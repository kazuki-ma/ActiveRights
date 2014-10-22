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
    using System.Security.Principal;

    public class DirectorySecurityController : ApiController
    {
        public OurDirectorySecurity Get(string unc)
        {
            return new Models.OurDirectorySecurity(new DirectoryInfo(unc));
        }


        public class OurAccessRuleModification
        {
            public Models.Ace From;
            public Models.Ace To;

            //public bool modifiAccessRule(FileSystemSecurity security) {
            //    if (From == null && To == null)
            //        return false;

            //    if (From == null)
            //        security.ModifyAccessRule(AccessControlModification.Add, To, null);
            //}
            public String Unc
            {
                set
                {
                    if (From != null)
                    {
                        From.Unc = value;
                    }
                    if (To != null)
                    {
                        To.Unc = value;
                    }
                }
            }

            public bool modifyAccessControl(FileSystemSecurity security)
            {
                if (From == null && To == null)
                    return true;
                
                bool modified = false;
                
                if(From != null)
                {
                    security.ModifyAccessRule(AccessControlModification.Remove, From.getAccessRule(), out modified);
                }
                if (To != null)
                {
                    security.ModifyAccessRule(AccessControlModification.Add, To.getAccessRule(), out modified);
                }

                return modified;
            }
        }

        public class OurAccessRuleModify
        {
            public List<OurAccessRuleModification> modifications { get; set; }
        }

        public void Post([FromUri] string unc, OurAccessRuleModify accessRuleModifies)
        {
            var fileSystemInfo = new DirectoryInfo(unc);
            var accessControl = fileSystemInfo.GetAccessControl(AccessControlSections.Access);

            using (var db = new ACEApproval())
            {
                foreach (OurAccessRuleModification modification in accessRuleModifies.modifications)
                {
                    bool modified = modification.modifyAccessControl(accessControl);

                    if (modified)
                    {
                        var ace = modification.To;
                        ace.Aprover = WindowsIdentity.GetCurrent().User.Value;
                        ace.EffectsBeginSchedule = ace.ApprovedDate = DateTime.Now;
                        ace.EffectsBegined = true;
                        ace.Unc = unc;

                        db.Aces.Add(ace);
                        db.SaveChanges();
                    }
                }
            }

            fileSystemInfo.SetAccessControl(accessControl);
        }
    }
}
