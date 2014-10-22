using System;
using System.Collections.Generic;
using System.Linq;

namespace ActiveRights.Models
{
    using System.Security.AccessControl;
    using System.Security.Principal;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    public class Ace
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Unc { get; set; }
        public string Sid { get; set; }
        public UInt32 FileSystemRights { get; set; }
        public UInt32 PropagationFlags { get; set; }
        public UInt32 InheritanceFlags { get; set; }
        public Boolean HasInconsistency { get; set; }
        public Boolean IsApproved
        {
            get
            {
                return this.ApprovedDate != null;
            }
        }
        public DateTime? ApprovedDate { get; set; }
        public String Aprover { get; set; }
        public DateTime? EffectsBeginSchedule { get; set; }
        public Boolean? EffectsBegined { get; set; }
        public DateTime? EffectsEndSchedule { get; set; }
        public Boolean? EffectsEnded { get; set; }

        public AccessRule getAccessRule()
        {
            return new FileSystemAccessRule(
                new SecurityIdentifier(Sid),
                (FileSystemRights)this.FileSystemRights, 
                (InheritanceFlags)this.InheritanceFlags,
                (PropagationFlags)this.PropagationFlags,
                AccessControlType.Allow);
        }
    }
}