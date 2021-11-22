using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SignUp_BE.Models
{
    public class Company
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [MaxLength(30)]
        public string Name { get; set; }

        [Required]
        [MaxLength(30)]
        public string Address { get; set; }

        [Required]
        [MaxLength(30)]
        [RegularExpression(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$")]
        public string Email { get; set; }  

        [Required]
        [MaxLength(30)]
        public string Description { get; set; }

        public List<JobAd> Ads { get; set; }

    }
}