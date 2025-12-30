import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } from "docx";
import FileSaver from "file-saver";

export const exportToDocx = async (content: string, filename: string) => {
  const lines = content.split('\n');
  const children = [];
  let tableBuffer: string[] = [];

  const flushTable = () => {
    if (tableBuffer.length === 0) return;

    const rows = [];
    for (let i = 0; i < tableBuffer.length; i++) {
        const rowContent = tableBuffer[i].trim();
        // Check if it is a separator row like |---|---| or | :--- | :--- |
        // Remove pipes, spaces, dashes, colons. If empty, it's a separator.
        const isSeparator = rowContent.replace(/[\|\-\:\s]/g, '') === '';
        
        if (isSeparator) {
            continue;
        }

        // Split by pipe. 
        // Example: "| Cell 1 | Cell 2 |" -> ["", " Cell 1 ", " Cell 2 ", ""]
        // We need to filter out the empty strings at the ends if they exist due to the surrounding pipes.
        let cells = rowContent.split('|');
        
        // Remove first element if empty (common in markdown tables)
        if (cells.length > 0 && cells[0].trim() === '') {
            cells.shift();
        }
        // Remove last element if empty
        if (cells.length > 0 && cells[cells.length - 1].trim() === '') {
            cells.pop();
        }

        const tableCells = cells.map(cellText => {
            // parse bold in cell: **text**
            const cellParts = cellText.trim().split('**');
            const cellRuns = cellParts.map((part, index) => {
                const isBold = index % 2 === 1;
                return new TextRun({
                    text: part,
                    bold: isBold,
                    font: "Times New Roman",
                    size: 24, // 12pt
                });
            });

            return new TableCell({
                children: [new Paragraph({ children: cellRuns })],
                width: {
                    size: 50, // 50% width for 2 columns
                    type: WidthType.PERCENTAGE,
                },
                borders: {
                    top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                },
                margins: {
                    top: 100, bottom: 100, left: 100, right: 100
                }
            });
        });

        rows.push(new TableRow({
            children: tableCells
        }));
    }

    if (rows.length > 0) {
        children.push(new Table({
            rows: rows,
            width: {
                size: 100,
                type: WidthType.PERCENTAGE,
            },
            borders: {
                top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            }
        }));
        children.push(new Paragraph({ text: "" })); // Spacing
    }
    tableBuffer = [];
  };

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    // Check if line is part of a table
    if (line.startsWith('|')) {
        tableBuffer.push(line);
        continue;
    } else {
        // Line is not part of a table. If we have a buffer, flush it.
        flushTable();
    }

    // Skip empty lines at start
    if (!line) {
        children.push(new Paragraph({ text: "" }));
        continue;
    }

    // Heading 1 (# )
    if (line.startsWith('# ')) {
      children.push(new Paragraph({
        children: [new TextRun({ 
            text: line.replace('# ', '').toUpperCase(), 
            bold: true,
            size: 32, // 16pt
            font: "Times New Roman"
        })],
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { before: 240, after: 240 },
      }));
      continue;
    }
    
    // Heading 2 (## )
    if (line.startsWith('## ')) {
       children.push(new Paragraph({
        children: [new TextRun({ 
            text: line.replace('## ', '').toUpperCase(), 
            bold: true,
            size: 28, // 14pt
            font: "Times New Roman"
        })],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 120 },
      }));
      continue;
    }

    // Heading 3 (### )
    if (line.startsWith('### ')) {
       children.push(new Paragraph({
        children: [new TextRun({ 
            text: line.replace('### ', ''), 
            bold: true,
            size: 28, // 14pt
            font: "Times New Roman"
        })],
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 120, after: 120 },
      }));
      continue;
    }

    // List items
    let bulletLevel = undefined;
    if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('+ ')) {
      bulletLevel = 0;
      line = line.substring(2);
    }

    // Parse Bold text (**text**)
    const parts = line.split('**');
    const runs = parts.map((part, index) => {
      const isBold = index % 2 === 1;
      return new TextRun({
        text: part,
        bold: isBold,
        font: "Times New Roman",
        size: 28, // 14pt
      });
    });

    children.push(new Paragraph({
      children: runs,
      bullet: bulletLevel !== undefined ? { level: bulletLevel } : undefined,
      spacing: { after: 120, line: 360 }, // 1.5 lines spacing
      alignment: AlignmentType.JUSTIFIED,
    }));
  }
  
  // Final flush in case the file ends with a table
  flushTable();

  const doc = new Document({
    styles: {
        default: {
            document: {
                run: {
                    font: "Times New Roman",
                    size: 28, // 14pt
                },
                paragraph: {
                    spacing: { line: 360 }, // 1.5 lines
                }
            },
        },
    },
    sections: [{
      properties: {},
      children: children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  const save = (FileSaver as any).saveAs || (FileSaver as any).default || FileSaver;
  save(blob, filename);
};