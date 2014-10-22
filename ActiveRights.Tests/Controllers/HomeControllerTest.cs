using System.Web.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ActiveRights;
using ActiveRights.Controllers;

namespace ActiveRights.Tests.Controllers
{
    [TestClass]
    public class HomeControllerTest
    {
        [TestMethod]
        public void Index()
        {

            var db = new ACEApproval();
            db.Database.Delete();
            db.Database.Initialize(true);
            {
                var a = db.Folders.Create();
                a.Unc = "";
                db.Folders.Add(a);
                db.SaveChanges();
            }

            Assert.IsTrue(true);
        }
    }
}
