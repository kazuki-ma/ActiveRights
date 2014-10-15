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
        public AuthorizationRuleCollection AccessRules;
        public AuthorizationRuleCollection AuditRules;


        public OurDirectorySecurity(DirectoryInfo directoryInfo)
        {
            DirectorySecurity = directoryInfo.GetAccessControl();
            AccessRules = DirectorySecurity.GetAccessRules(true, true, typeof(System.Security.Principal.NTAccount));
            AuditRules = DirectorySecurity.GetAuditRules(true, true, typeof(System.Security.Principal.NTAccount));
        }
    }
}