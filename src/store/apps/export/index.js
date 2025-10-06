import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'src/configs/axios';
import { swalToastError } from 'src/helpers/swalFunction';

export const ENUM = {
    SALES_ORDER: 'SALES_ORDER',
    CUSTOMER: 'CUSTOMER'
}

// Export Report
export const exportReport = createAsyncThunk('appExportReport/exportReport', async ({ reportType, month, year }, { rejectWithValue }) => {
    try {
        const response = await axios({
            method: 'GET',
            url: `/export/report`,
            params: { reportType, month, year },
            responseType: 'arraybuffer', // Important: treat response as a file
        });

        const type = response.headers['content-type'];
        const contentDisposition = response.headers['content-disposition'];

        // Extract filename from Content-Disposition header
        let filename = `${reportType}_Report.xlsx`;
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename\*?=["']?([^"';\n]+)["']?/);
            if (filenameMatch) {
                filename = decodeURIComponent(filenameMatch[1]); // Decode in case of special characters
            }
        }

        // Create Blob from response
        const blob = new Blob([response.data], { type });

        // Trigger file download
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Cleanup Blob URL
        window.URL.revokeObjectURL(blobUrl);
        return { success: true };
    } catch (error) {
        let errorMessage = 'Export Gagal';

        // Check if backend responded with a message
        if (
            error.response &&
            error.response.data &&
            error.response.headers['content-type']?.includes('application/json')
        ) {
            try {
                // Decode the arraybuffer to string and parse JSON
                const decoder = new TextDecoder('utf-8');
                const jsonString = decoder.decode(error.response.data);
                const json = JSON.parse(jsonString);

                if (json?.message) {
                    errorMessage = `Export ${json.message}`;
                }
            } catch (parseError) {
                console.error('Failed to parse error response:', parseError);
            }
        }

        console.error('Error exporting report:', error);
        swalToastError({ label: errorMessage });

        return rejectWithValue({ success: false, error: errorMessage });
    }
});

export const appExportReportSlice = createSlice({
    name: 'appExportReport',
    initialState: {
        success: null,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(exportReport.fulfilled, (state, action) => {
            state.success = action.payload.success;
            state.error = null;
        });
        builder.addCase(exportReport.rejected, (state, action) => {
            state.success = false;
            state.error = action.payload.error;
        });
    },
});

export default appExportReportSlice.reducer;