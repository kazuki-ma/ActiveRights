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
        // GET: api/Directory/5
        public IEnumerable<FileSystemInfo> GetSubdirectory(string unc)
        {
            return (new DirectoryInfo(unc)).EnumerateFileSystemInfos();
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
