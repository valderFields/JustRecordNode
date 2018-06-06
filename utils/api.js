/*function getRootDir() {
  let rootDir = curDir;
  return co(function *() {
    while(true) {
      if(yield isExitFile(rootDir, 'package.json')) {
        break;
      }
      rootDir = path.join(rootDir, up);
    }
    return rootDir;
  })
  
}*/