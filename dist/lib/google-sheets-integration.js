import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
export class GoogleSheetsManager {
    auth;
    sheets;
    config;
    constructor(config) {
        this.config = config;
        this.auth = new JWT({
            email: config.credentials.client_email,
            key: config.credentials.private_key,
            scopes: config.scopes
        });
        this.sheets = google.sheets({ version: 'v4', auth: this.auth });
    }
    async createSpreadsheet(title, description) {
        try {
            const response = await this.sheets.spreadsheets.create({
                requestBody: {
                    properties: {
                        title,
                        description: description || 'Created by iGaming Management Suite'
                    },
                    sheets: [{
                            properties: {
                                title: 'Data',
                                gridProperties: {
                                    rowCount: 1000,
                                    columnCount: 20
                                }
                            }
                        }]
                }
            });
            return response.data.spreadsheetId;
        }
        catch (error) {
            console.error('Failed to create spreadsheet:', error);
            throw new Error('Failed to create Google Spreadsheet');
        }
    }
    async getSheetData(range) {
        try {
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.config.spreadsheetId,
                range
            });
            return {
                range: response.data.range || range,
                values: response.data.values || [],
                majorDimension: response.data.majorDimension || 'ROWS'
            };
        }
        catch (error) {
            console.error('Failed to get sheet data:', error);
            throw new Error('Failed to retrieve data from Google Sheets');
        }
    }
    async updateSheetData(range, values) {
        try {
            await this.sheets.spreadsheets.values.update({
                spreadsheetId: this.config.spreadsheetId,
                range,
                valueInputOption: 'RAW',
                requestBody: {
                    values
                }
            });
            return true;
        }
        catch (error) {
            console.error('Failed to update sheet data:', error);
            return false;
        }
    }
    async appendData(range, values) {
        try {
            await this.sheets.spreadsheets.values.append({
                spreadsheetId: this.config.spreadsheetId,
                range,
                valueInputOption: 'RAW',
                insertDataOption: 'INSERT_ROWS',
                requestBody: {
                    values
                }
            });
            return true;
        }
        catch (error) {
            console.error('Failed to append data:', error);
            return false;
        }
    }
    async clearSheet(range) {
        try {
            await this.sheets.spreadsheets.values.clear({
                spreadsheetId: this.config.spreadsheetId,
                range
            });
            return true;
        }
        catch (error) {
            console.error('Failed to clear sheet:', error);
            return false;
        }
    }
    async createFormFromTemplate(template) {
        try {
            // Create new spreadsheet
            const spreadsheetId = await this.createSpreadsheet(`iGaming Form - ${template.name}`, template.description);
            // Set up headers
            const headers = template.columns.map(col => col.name);
            await this.updateSheetData('A1', [headers]);
            // Add sample data
            if (template.sampleData.length > 0) {
                await this.appendData('A2', template.sampleData);
            }
            // Format headers
            await this.formatHeaders(spreadsheetId, 'A1:Z1');
            // Add data validation
            await this.addDataValidation(spreadsheetId, template.validationRules);
            return spreadsheetId;
        }
        catch (error) {
            console.error('Failed to create form from template:', error);
            throw new Error('Failed to create Google Sheets form');
        }
    }
    async formatHeaders(spreadsheetId, range) {
        try {
            await this.sheets.spreadsheets.batchUpdate({
                spreadsheetId,
                requestBody: {
                    requests: [{
                            repeatCell: {
                                range: {
                                    sheetId: 0,
                                    startRowIndex: 0,
                                    endRowIndex: 1
                                },
                                cell: {
                                    userEnteredFormat: {
                                        backgroundColor: {
                                            red: 0.2,
                                            green: 0.4,
                                            blue: 0.8
                                        },
                                        textFormat: {
                                            foregroundColor: {
                                                red: 1,
                                                green: 1,
                                                blue: 1
                                            },
                                            bold: true
                                        }
                                    }
                                },
                                fields: 'userEnteredFormat(backgroundColor,textFormat)'
                            }
                        }]
                }
            });
        }
        catch (error) {
            console.error('Failed to format headers:', error);
        }
    }
    async addDataValidation(spreadsheetId, rules) {
        try {
            const requests = rules.map((rule, index) => {
                const columnIndex = index; // Assuming rules are in column order
                return {
                    setDataValidation: {
                        range: {
                            sheetId: 0,
                            startRowIndex: 1,
                            endRowIndex: 1000,
                            startColumnIndex: columnIndex,
                            endColumnIndex: columnIndex + 1
                        },
                        rule: {
                            condition: this.getValidationCondition(rule),
                            showCustomUi: true,
                            strict: true
                        }
                    }
                };
            });
            await this.sheets.spreadsheets.batchUpdate({
                spreadsheetId,
                requestBody: { requests }
            });
        }
        catch (error) {
            console.error('Failed to add data validation:', error);
        }
    }
    getValidationCondition(rule) {
        switch (rule.type) {
            case 'required':
                return {
                    type: 'CUSTOM_FORMULA',
                    values: [{ userEnteredValue: `=LEN(A${rule.column})>0` }]
                };
            case 'email':
                return {
                    type: 'CUSTOM_FORMULA',
                    values: [{ userEnteredValue: `=REGEXMATCH(A${rule.column}, "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")` }]
                };
            case 'url':
                return {
                    type: 'CUSTOM_FORMULA',
                    values: [{ userEnteredValue: `=REGEXMATCH(A${rule.column}, "^https?://")` }]
                };
            case 'number':
                return {
                    type: 'NUMBER_GREATER',
                    values: [{ userEnteredValue: '0' }]
                };
            case 'date':
                return {
                    type: 'DATE_IS_VALID'
                };
            case 'regex':
                return {
                    type: 'CUSTOM_FORMULA',
                    values: [{ userEnteredValue: `=REGEXMATCH(A${rule.column}, "${rule.value}")` }]
                };
            default:
                return { type: 'NUMBER_GREATER', values: [{ userEnteredValue: '0' }] };
        }
    }
    async importData(data, template) {
        const result = {
            success: true,
            rowsProcessed: 0,
            rowsImported: 0,
            errors: [],
            warnings: []
        };
        try {
            const validatedData = [];
            for (let i = 0; i < data.length; i++) {
                const row = data[i];
                result.rowsProcessed++;
                const validatedRow = this.validateRow(row, template, i + 1, result);
                if (validatedRow) {
                    validatedData.push(validatedRow);
                    result.rowsImported++;
                }
            }
            if (validatedData.length > 0) {
                await this.appendData('A2', validatedData);
            }
            result.success = result.errors.length === 0;
        }
        catch (error) {
            console.error('Import failed:', error);
            result.success = false;
            result.errors.push({
                row: 0,
                column: 'system',
                message: error instanceof Error ? error.message : 'Unknown error',
                value: null
            });
        }
        return result;
    }
    validateRow(row, template, rowIndex, result) {
        const validatedRow = [];
        let hasErrors = false;
        for (let i = 0; i < template.columns.length; i++) {
            const column = template.columns[i];
            const value = row[column.name] || row[i] || '';
            // Check required fields
            if (column.required && (!value || value.toString().trim() === '')) {
                result.errors.push({
                    row: rowIndex,
                    column: column.name,
                    message: `${column.name} is required`,
                    value
                });
                hasErrors = true;
                continue;
            }
            // Validate data type
            const validationError = this.validateValue(value, column, template.validationRules[i]);
            if (validationError) {
                result.errors.push({
                    row: rowIndex,
                    column: column.name,
                    message: validationError,
                    value
                });
                hasErrors = true;
            }
            validatedRow.push(this.convertValue(value, column.type));
        }
        return hasErrors ? null : validatedRow;
    }
    validateValue(value, column, rule) {
        if (!value || value.toString().trim() === '') {
            return null; // Empty values are handled by required check
        }
        const stringValue = value.toString().trim();
        switch (column.type) {
            case 'email':
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailRegex.test(stringValue)) {
                    return 'Invalid email format';
                }
                break;
            case 'url':
                const urlRegex = /^https?:\/\/.+/;
                if (!urlRegex.test(stringValue)) {
                    return 'Invalid URL format';
                }
                break;
            case 'number':
                if (isNaN(Number(stringValue))) {
                    return 'Must be a valid number';
                }
                break;
            case 'date':
                if (isNaN(Date.parse(stringValue))) {
                    return 'Must be a valid date';
                }
                break;
            case 'boolean':
                if (!['true', 'false', '1', '0', 'yes', 'no'].includes(stringValue.toLowerCase())) {
                    return 'Must be true/false, 1/0, or yes/no';
                }
                break;
        }
        return null;
    }
    convertValue(value, type) {
        if (!value || value.toString().trim() === '') {
            return '';
        }
        const stringValue = value.toString().trim();
        switch (type) {
            case 'number':
                return Number(stringValue);
            case 'boolean':
                return ['true', '1', 'yes'].includes(stringValue.toLowerCase());
            case 'date':
                return new Date(stringValue).toISOString().split('T')[0];
            default:
                return stringValue;
        }
    }
    // Predefined templates for common iGaming use cases
    static getTemplates() {
        return [
            {
                name: 'Player Data Import',
                description: 'Template for importing player data from external sources',
                columns: [
                    { name: 'Player ID', type: 'string', required: true, description: 'Unique player identifier' },
                    { name: 'Email', type: 'email', required: true, description: 'Player email address' },
                    { name: 'Full Name', type: 'string', required: true, description: 'Player full name' },
                    { name: 'Country', type: 'string', required: true, description: 'Player country code' },
                    { name: 'Registration Date', type: 'date', required: true, description: 'Date of registration' },
                    { name: 'Total Deposits', type: 'number', required: false, description: 'Total amount deposited' },
                    { name: 'VIP Status', type: 'boolean', required: false, description: 'VIP player status' }
                ],
                sampleData: [
                    ['PLAYER_001', 'player1@example.com', 'John Doe', 'US', '2024-01-15', 1500, true],
                    ['PLAYER_002', 'player2@example.com', 'Jane Smith', 'UK', '2024-01-20', 800, false]
                ],
                validationRules: [
                    { column: 'A', type: 'required', message: 'Player ID is required' },
                    { column: 'B', type: 'email', message: 'Valid email is required' },
                    { column: 'C', type: 'required', message: 'Full name is required' },
                    { column: 'D', type: 'required', message: 'Country is required' },
                    { column: 'E', type: 'date', message: 'Valid date is required' }
                ]
            },
            {
                name: 'Domain Monitoring',
                description: 'Template for monitoring suspicious domains',
                columns: [
                    { name: 'Domain', type: 'url', required: true, description: 'Domain to monitor' },
                    { name: 'Risk Level', type: 'string', required: true, description: 'High, Medium, Low' },
                    { name: 'Detection Date', type: 'date', required: true, description: 'Date domain was detected' },
                    { name: 'Similarity Score', type: 'number', required: false, description: 'Similarity to original brand' },
                    { name: 'Status', type: 'string', required: true, description: 'Active, Resolved, False Positive' },
                    { name: 'Notes', type: 'string', required: false, description: 'Additional notes' }
                ],
                sampleData: [
                    ['https://suspicious-site.com', 'High', '2024-01-15', 85, 'Active', 'Potential trademark infringement'],
                    ['https://another-site.net', 'Medium', '2024-01-16', 65, 'Monitoring', 'Similar design detected']
                ],
                validationRules: [
                    { column: 'A', type: 'url', message: 'Valid URL is required' },
                    { column: 'B', type: 'regex', value: '^(High|Medium|Low)$', message: 'Risk level must be High, Medium, or Low' },
                    { column: 'C', type: 'date', message: 'Valid date is required' },
                    { column: 'E', type: 'regex', value: '^(Active|Resolved|False Positive)$', message: 'Status must be Active, Resolved, or False Positive' }
                ]
            },
            {
                name: 'Compliance Tracking',
                description: 'Template for tracking regulatory compliance',
                columns: [
                    { name: 'License Number', type: 'string', required: true, description: 'Gaming license number' },
                    { name: 'Jurisdiction', type: 'string', required: true, description: 'Regulatory jurisdiction' },
                    { name: 'Expiry Date', type: 'date', required: true, description: 'License expiry date' },
                    { name: 'Status', type: 'string', required: true, description: 'Active, Expired, Suspended' },
                    { name: 'Last Audit', type: 'date', required: false, description: 'Last compliance audit date' },
                    { name: 'Next Review', type: 'date', required: false, description: 'Next scheduled review' }
                ],
                sampleData: [
                    ['MGA/B2C/123/2020', 'Malta', '2025-12-31', 'Active', '2024-01-15', '2024-07-15'],
                    ['UKGC-456789', 'United Kingdom', '2024-06-30', 'Active', '2024-01-10', '2024-04-10']
                ],
                validationRules: [
                    { column: 'A', type: 'required', message: 'License number is required' },
                    { column: 'B', type: 'required', message: 'Jurisdiction is required' },
                    { column: 'C', type: 'date', message: 'Valid expiry date is required' },
                    { column: 'D', type: 'regex', value: '^(Active|Expired|Suspended)$', message: 'Status must be Active, Expired, or Suspended' }
                ]
            }
        ];
    }
    async exportToCSV(range) {
        try {
            const data = await this.getSheetData(range);
            const csv = data.values.map(row => row.map(cell => `"${cell.toString().replace(/"/g, '""')}"`).join(',')).join('\n');
            return csv;
        }
        catch (error) {
            console.error('Failed to export CSV:', error);
            throw new Error('Failed to export data to CSV');
        }
    }
    async getSheetMetadata() {
        try {
            const response = await this.sheets.spreadsheets.get({
                spreadsheetId: this.config.spreadsheetId
            });
            return response.data;
        }
        catch (error) {
            console.error('Failed to get sheet metadata:', error);
            throw new Error('Failed to retrieve spreadsheet metadata');
        }
    }
}
