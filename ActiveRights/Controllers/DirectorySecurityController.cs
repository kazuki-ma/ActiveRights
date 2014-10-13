using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ActiveRights.Controllers
{
    using ActiveRights.Models;
    using System.IO;
    using System.Security.AccessControl;

    public class DirectorySecurityController : ApiController
    {
        public OurDirectorySecurity Get(string unc)
        {
            return new Models.OurDirectorySecurity(new DirectoryInfo(unc));
        }

        public class OurAccessRuleModify
        {
            public OurAccessRuleModify()
            {

            }
            public string Test { get; set; }
            public AccessControlModification AccessControlModification { get; set; }
        }

        public void Post([FromUri] string unc, OurAccessRuleModify accessRuleModifies)
        {
            var fileSystemInfo = new DirectoryInfo(unc);
            var accessControl = fileSystemInfo.GetAccessControl(AccessControlSections.Access);
            if (null == accessRuleModifies)
            {
                return;
            }

            //foreach (OurAccessRuleModify accessRuleModify in accessRuleModifies)
            //{
            //    bool isSuccess;

            //    //accessControl.ModifyAccessRule(
            //    //    accessRuleModify.AccessControlModification,
            //    //    accessRuleModify.AccessRule,
            //    //    out isSuccess
            //    //    );
            //}

            fileSystemInfo.SetAccessControl(accessControl);
        }
    }
}
