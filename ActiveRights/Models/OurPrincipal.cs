using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ActiveRights.Models
{
    using System.DirectoryServices.AccountManagement;
    using System.DirectoryServices;
    using System.Runtime.Serialization;

    [DataContractAttribute]
    public class OurPrincipal
    {
        [DataMember]
        public string displayName;
        [DataMember]
        public string sAMAccountName;
        [DataMember]
        public string sIDString;
        [DataMember]
        public string guid;
        [DataMember]
        public List<OurPrincipal> members;

        private OurPrincipal(Principal principal, bool recurse = true)
        {
            this.displayName = principal.DisplayName;
            this.sAMAccountName = principal.SamAccountName;
            this.sIDString = principal.Sid.Value;

            if (recurse && (principal is GroupPrincipal))
            {
                this.members = (from member in (principal as GroupPrincipal).Members
                               select new OurPrincipal(member, false)).ToList()
                               ;
                
            }
        }

        public static OurPrincipal Convert(Principal principal) {
            return new OurPrincipal(principal);
        }

        public OurPrincipal()
        {
        }
    }
}