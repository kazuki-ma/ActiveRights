using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ActiveRights.Controllers
{
    using Models;

    using System.DirectoryServices.AccountManagement;
    public class PrincipalController : ApiController
    {
        public OurPrincipal GetMembers(string identity, string unc)
        {
            ContextType[] cts = {
                                    ContextType.Domain,
                                    ContextType.Machine
                                };

            foreach(ContextType ct in cts) {
                var pcx = new PrincipalContext(ct);
                var principal = Principal.FindByIdentity(pcx, identity);

                if (principal != null)
                {
                    return OurPrincipal.Convert(principal);
                }
            }
            return null;
        }

        // POST: api/Group
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Group/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Group/5
        public void Delete(int id)
        {
        }
    }
}
