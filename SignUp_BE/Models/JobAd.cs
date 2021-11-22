using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SignUp_BE.Models
{
    public class JobAd
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [MaxLength(30)]
        public string Position { get; set; }

        [Required]
        public DateTime Deadline { get; set; }

        [Required]
        public bool Remote { get; set; }

        [Required]
        public int NumApl { get; set; }

        [JsonIgnore]
        public Company Company { get; set; }

        public List<User> Users { get; set; }

    }
}