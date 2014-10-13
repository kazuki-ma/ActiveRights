using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ActiveRights.Models
{
    using System.IO;
    using System.Security.AccessControl;

    
    public class OurDirectorySecurity
    {
        public DirectorySecurity DirectorySecurity;
        public AuthorizationRuleCollection AccessRule;
        public AuthorizationRuleCollection AuditRule;


        public OurDirectorySecurity(DirectoryInfo directoryInfo)
        {
            DirectorySecurity = directoryInfo.GetAccessControl();
            AccessRule = DirectorySecurity.GetAccessRules(true, true, typeof(System.Security.Principal.NTAccount));
            AuditRule = DirectorySecurity.GetAuditRules(true, true, typeof(System.Security.Principal.NTAccount));
        }
    }
}