using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.IO;
using System.Security.AccessControl;

namespace ActiveRights.Controllers
{
    public class DirectoryController : ApiController
    {
        public class DynatreeNode
        {
            public string title;
            public string key;
            public bool isFolder;
            public bool isLazy;
            public string tooltip;
            public string addClass;
            public bool unselectable;

            public DynatreeNode(FileSystemInfo fileSystemInfo)
            {
                title = fileSystemInfo.Name;
                key = fileSystemInfo.FullName;
                isFolder = 0 != (fileSystemInfo.Attributes & FileAttributes.Directory);
                isLazy = true;
                addClass = "";

                if (fileSystemInfo is DirectoryInfo)
                {
                    DirectoryInfo di = (DirectoryInfo)fileSystemInfo;
                    try
                    {
                        if (hasUniqueAce(di.GetAccessControl()))
                        {
                            addClass += " hasUniqueAce ";
                        }
                    }
                    catch (UnauthorizedAccessException e) { }
                }

            }


            static bool hasUniqueAce(FileSystemSecurity fss)
            {
                var accessRules = fss.GetAccessRules(true, false, typeof(System.Security.Principal.SecurityIdentifier));
                return 0 < accessRules.Count;
            }
        }

        // GET: api/Directory/5
        public IEnumerable<DynatreeNode> GetSubdirectory(string unc)
        {
            LinkedList<DynatreeNode> list = new LinkedList<DynatreeNode>();

            foreach(var dir in (new DirectoryInfo(unc)).EnumerateFileSystemInfos()) {
                list.AddLast(new DynatreeNode(dir));
            }

            return list;
        }

        // PUT: api/Directory/5
        public void Put(string unc)
        {
            Directory.CreateDirectory(unc);
        }

        // DELETE: api/Directory/5
        public void Delete(string unc)
        {
            Directory.Delete(unc, true);
        }

    }
}
