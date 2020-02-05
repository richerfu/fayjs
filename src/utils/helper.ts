import {
  writeFile,
  mkdir,
  existsSync,
  readdirSync,
  statSync,
  unlinkSync,
  rmdirSync,
  exists,
} from "fs";
import { filePath } from "../loader/FileLoad";
/**
 * 生成最终的.d.ts文件字符串
 * @param moduleName "SoController" | "SoService" | "SoMiddleware"
 * @param prop string
 */
export const FinalTemplate = (
  moduleName: string,
  importContent: string,
  prop: string
): string => {
  return `import { ${moduleName} } from 'iqy-server';
  ${importContent}
  declare module 'iqy-server' {
    interface ${moduleName} {
      ${prop}
    }
  }
  `;
};

/**
 * 写.d.ts文件
 * @param path string
 * @param content string
 */
export const writeTypingsFile = async (
  path: string,
  content: string
): Promise<any> => {
  const res = new Promise((s, j) => {
    writeFile(path, content, e => {
      if (e) {
        j(e);
      }
      s();
    });
  });
};

/**
 * 生成.d.ts文件对应的interface 属性键值对
 * @param key string 属性名
 * @param value string  属性类型
 */
export const GeneratorProp = (key: string, value: string): string => {
  return `${key}: ${value}; \n`;
};

/**
 * 创建文件夹
 * @param path string
 */
export const MkdirFolder = async (path: string): Promise<any> => {
  const folder: boolean = await new Promise((s, j) => {
    exists(path, exists => {
      s(exists);
    });
  });
  if (folder) {
    return null;
  }
  const result = await new Promise((s, j) => {
    mkdir(path, () => {
      s();
    });
  });
  return null;
};

export const FindModulePath = (moduleName: string): string | void => {
  for (const modules of filePath) {
    if (modules[1].includes(moduleName)) {
      return `import { ${moduleName} } from '${modules[0].replace(/\.ts$/,"")}'; \n`;
    }
  }
};

export const DelDir = (path: string) => {
  let files = [];
  if (existsSync(path)) {
    files = readdirSync(path);
    files.forEach((file, index) => {
      let curPath = path + "/" + file;
      if (statSync(curPath).isDirectory()) {
        DelDir(curPath); //递归删除文件夹
      } else {
        unlinkSync(curPath); //删除文件
      }
    });
    rmdirSync(path);
  }
};
