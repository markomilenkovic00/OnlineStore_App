class UserInfoDto {
    constructor(username, email, name, surname, address, picture) {
      this.username = username || "";
      this.email = email || "";
      this.name = name || "";
      this.surname = surname || "";
      this.address = address || "";
      this.picture = picture || null;
    }
  }
  
  export default UserInfoDto;
  