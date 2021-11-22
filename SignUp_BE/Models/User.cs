using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SignUp_BE.Models
{
    [Table("User")]
    public class User
    {
        [Key]
        [Column("ID")]
        public int ID { get; set; }

        [Column("Username")]
        [Required]
        [MaxLength(30)]
        public string Username { get; set; }

        [Column("FirstName")]
        [Required]
        [MaxLength(30)]
        public string FirstName { get; set; }

        [Column("LastName")]
        [Required]
        [MaxLength(30)]
        public string LastName { get; set; }

        [Column("Email")]
        [Required]
        [MaxLength(30)]
        [RegularExpression(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$")]
        public string Email { get; set; }

        [Column("Address")]
        [Required]
        [MaxLength(30)]
        public string Address { get; set; }

        [Column("Degree")]
        [Required]
        [MaxLength(30)]
        public string Degree { get; set; }

        [JsonIgnore]
        public List<JobAd> Ads { get; set; }
    }
}