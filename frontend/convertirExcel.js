const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const excelFilePath = path.join(__dirname, 'PruebasUsuarios.xlsx');
const outputFilePath = path.join(__dirname, 'src', 'data', 'usuarios_gelsa.json');

try {
  // Asegurarnos que exista la carpeta src/data
  const dataDir = path.dirname(outputFilePath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Leer el archivo Excel
  console.log(`Leyendo archivo Excel desde: ${excelFilePath}`);
  const workbook = xlsx.readFile(excelFilePath);
  
  // Tomar la primera hoja
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  
  // Convertir a JSON
  const data = xlsx.utils.sheet_to_json(sheet);
  
  // Extraer la columna DOCUMENTO y limpiar (convertir a string y quitar vacíos)
  const documentos = data
    .map(row => row.DOCUMENTO)
    .filter(doc => doc !== undefined && doc !== null && String(doc).trim() !== '')
    .map(doc => String(doc).trim());
    
  console.log(`Se encontraron ${documentos.length} documentos válidos.`);
  
  // Escribir el archivo JSON
  fs.writeFileSync(outputFilePath, JSON.stringify(documentos, null, 2), 'utf-8');
  console.log(`✅ Archivo JSON generado exitosamente en: ${outputFilePath}`);
} catch (error) {
  console.error('❌ Error al procesar el archivo Excel:', error.message);
}
