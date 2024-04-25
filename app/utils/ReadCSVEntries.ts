import RNFS from 'react-native-fs';
import {parse} from 'csv-parse/lib/sync';

// Function to process the data
function process(data: any): void {
    console.log("Processing data:", data);
    // Implement your processing logic here for one line of data
}

// Function to clear the CSV file content
function clearCsvFile(filePath: string): void {
    RNFS.writeFile(filePath, '', 'utf8')
        .then(() => console.log("CSV file has been cleared."))
        .catch(err => console.error("Failed to clear CSV file", err));
}

// Function to read and process CSV file
async function readAndProcessCsv(filePath: string): Promise<void> {
    try {
        const fileContents = await RNFS.readFile(filePath, 'utf8');
        console.log(fileContents);
        const records = parse(fileContents, { columns: true, delimiter: ',' });
        // Process each record one by one
        for (const record of records) {
            process(record);
        }
        clearCsvFile(filePath); // Optionally clear the file after processing all records
    } catch (error) {
        console.error("Error reading or processing CSV file:", error);
    }
}

function processLine(line : any) {
    const records = parse(line, { columns: false, trim: true, delimiter: ',' });
    if (records.length > 0 && records[0].length === 49) { // Ensure there are exactly 49 entries
        console.log("Processing line data:", records[0]);
        // Implement additional processing logic here
    } else {
        console.error("Line format error, expected 49 entries, received:", records[0].length);
    }
}

async function processCsvLineByLine(filePath: string) {
    try {
        let fileStats = await RNFS.stat(filePath);
        let currentPosition = 0;
        let bufferSize = 1024; // Adjust based on the expected length of the line
        let buffer = '';

        while (currentPosition < fileStats.size) {
            const chunk = await RNFS.read(filePath, bufferSize, currentPosition, 'utf8');
            buffer += chunk;
            let eolIndex;

            // Process each line contained in the buffer
            while ((eolIndex = buffer.indexOf('\n')) !== -1) {
                let line = buffer.substring(0, eolIndex).trim();
                if (line) {
                    processLine(line);
                }
                buffer = buffer.substring(eolIndex + 1);
            }

            currentPosition += chunk.length;
        }

        // Process any remaining data in buffer if it's a complete line
        if (buffer.trim()) {
            processLine(buffer.trim());
        }
    } catch (error) {
        console.error("Error processing CSV line by line:", error);
    }
}

// Function to monitor CSV file
function monitorCsvFile(filePath: string): void {
    let lastModifiedTime = '';
    filePath = RNFS.DocumentDirectoryPath + '/combinedData.csv';
    filePath = '/storage/emulated/0/Android/data/com.akselerometroprogramele/files/combinedData.csv';
    console.log(filePath);

    setInterval(async () => {
        try {
            const stats = await RNFS.stat(filePath);
            if (stats.mtime.toString() !== lastModifiedTime) {
                console.log("File has changed, reading new data");
                lastModifiedTime = stats.mtime.toString(); // Update last modified time as a string
                await processCsvLineByLine(filePath);
            }
        } catch (error) {
            console.error("Error checking file stats:", error);
        }
    }, 5000); // Check every 5 seconds
}

export { monitorCsvFile };
