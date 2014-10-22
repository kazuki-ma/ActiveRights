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
        public List<Ace> Aces;


        public OurDirectorySecurity(DirectoryInfo directoryInfo)
        {
            DirectorySecurity = directoryInfo.GetAccessControl();
            AccessRules = DirectorySecurity.GetAccessRules(true, true, typeof(System.Security.Principal.NTAccount));
            AuditRules = DirectorySecurity.GetAuditRules(true, true, typeof(System.Security.Principal.SecurityIdentifier));

            using(var db = new ACEApproval())
            {
                var aces = db.Aces.Where(ace => ace.Unc == directoryInfo.FullName);
                this.Aces = aces.ToList();
            }

            foreach (AccessRule rule in this.AccessRules)
            {
                if (rule.IsInherited)
                    continue;

                if (this.Aces.Where(ace => (ace.Sid == rule.IdentityReference.Value)).Count() > 0)
                {
                    // ACE に対応する承認記録がある
                    
                }
                else
                {
                    // ACE に対応する承認記録がない

                }
            }
        }
    }
}