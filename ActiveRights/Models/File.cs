using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Security.AccessControl;

namespace ActiveRights.Models
{
    public class File
    {
        public FileInfo FileInfo;
        public File(FileInfo fi) {
            this.FileInfo = fi;
            
        }

        public FileSecurity MyProperty { 
            get {
                return this.FileInfo.GetAccessControl();
            }
        }
    }
}