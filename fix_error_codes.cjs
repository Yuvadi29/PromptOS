const fs = require('fs');

const walkSync = function(dir, filelist) {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      filelist = walkSync(dir + '/' + file, filelist);
    }
    else {
      if (file.endsWith('.ts')) {
        filelist.push(dir + '/' + file);
      }
    }
  });
  return filelist;
};

const files = walkSync('./app/api/v1');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  content = content.replace(/code:\s*['"]BAD_REQUEST['"]/g, "code: 'VALIDATION_ERROR'");
  content = content.replace(/code:\s*['"]UNAUTHORIZED['"]/g, "code: 'AUTHENTICATION_ERROR'");
  content = content.replace(/code:\s*['"]NOT_FOUND['"]/g, "code: 'RESOURCE_NOT_FOUND'");
  
  content = content.replace(/code:\s*error\.message\s*===\s*['"]Missing promptId['"]\s*\?\s*['"]BAD_REQUEST['"]\s*:\s*['"]INTERNAL_SERVER_ERROR['"]/g, "code: error.message === 'Missing promptId' ? 'VALIDATION_ERROR' : 'INTERNAL_SERVER_ERROR'");
  content = content.replace(/code:\s*error\.message\s*===\s*['"]Missing Data['"]\s*\?\s*['"]BAD_REQUEST['"]\s*:\s*['"]INTERNAL_SERVER_ERROR['"]/g, "code: error.message === 'Missing Data' ? 'VALIDATION_ERROR' : 'INTERNAL_SERVER_ERROR'");
  content = content.replace(/code:\s*error\.message\s*===\s*['"]Content is required['"]\s*\?\s*['"]BAD_REQUEST['"]\s*:\s*['"]INTERNAL_SERVER_ERROR['"]/g, "code: error.message === 'Content is required' ? 'VALIDATION_ERROR' : 'INTERNAL_SERVER_ERROR'");
  content = content.replace(/code:\s*error\.message\s*===\s*['"]Invalid data['"]\s*\?\s*['"]BAD_REQUEST['"]\s*:\s*['"]INTERNAL_SERVER_ERROR['"]/g, "code: error.message === 'Invalid data' ? 'VALIDATION_ERROR' : 'INTERNAL_SERVER_ERROR'");
  content = content.replace(/code:\s*error\.message\.includes\(['"]not found['"]\)\s*\?\s*['"]NOT_FOUND['"]\s*:\s*['"]INTERNAL_SERVER_ERROR['"]/g, "code: error.message.includes('not found') ? 'RESOURCE_NOT_FOUND' : 'INTERNAL_SERVER_ERROR'");

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
  }
});
