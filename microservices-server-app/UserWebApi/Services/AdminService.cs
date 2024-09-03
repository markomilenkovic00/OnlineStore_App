using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using UserWebApi.Dto;
using UserWebApi.Infrastructure;
using UserWebApi.Interfaces;
using UserWebApi.Models;
using UserWebApi.Repositories;

namespace UserWebApi.Services
{
    public class AdminService : IAdminService
    {
        private readonly IMapper _mapper;
        private readonly UsersRepository _usersRepository;
        public AdminService(IMapper mapper, UserDbContext dbContext)
        {
            _mapper = mapper;
            _usersRepository = new UsersRepository(dbContext);
        }
        public async Task<string> DoVerifySeller(long Id, bool verified)
        {
            User u = await _usersRepository.GetUserByIdAsync(Id);
            if (u == null)
                throw new Exception("Error. The user does not exist in database.");
            if (u.UserType != "prodavac")
                throw new Exception("Error. You can only verify sellers.");
            if (u.Verify != false)
                throw new Exception("Error. The user is already verified.");

            if (verified)
            {
                u.Verify = true;
                SendEmail(u.Email, "Your account is now verified.");
                await _usersRepository.SaveChangesAsync();
                return "True";
            }
            else
            {
                u.Verify = null;
                SendEmail(u.Email, "Your account verification is denied.");
                await _usersRepository.SaveChangesAsync();
                return "Denied";
            }
        }

        public async Task<List<GetUserProfileDto>> GetSellers()
        {
            List<GetUserProfileDto> lista = new List<GetUserProfileDto>();
            foreach (User u in await _usersRepository.GetAllUsersAsync())
                if (u.UserType == "prodavac")
                    lista.Add(_mapper.Map<GetUserProfileDto>(u));
            return lista;
        }

        public void SendEmail(string ToEmail, string EmailBody)
        {
            SmtpClient smtpClient = new SmtpClient("smtp.gmail.com", 587);
            smtpClient.EnableSsl = true;
            smtpClient.Credentials = new NetworkCredential("webprogramiranje2projekat@gmail.com", "byltqtvyyvvqddsr");
            MailMessage mailMessage = new MailMessage();
            mailMessage.From = new MailAddress("webprogramiranje2projekat@gmail.com");
            mailMessage.To.Add(ToEmail);
            mailMessage.Subject = "Verification Info";
            mailMessage.Body = EmailBody;
            smtpClient.Send(mailMessage);
        }
    }
}
