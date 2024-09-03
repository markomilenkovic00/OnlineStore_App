class UserProfileDto {
    constructor(id, username, password, email, name, surname, dateOfBirth, address, picture, verify) {
      this.id = id || 0;
      this.username = username || "";
      this.password = password || "";
      this.email = email || "";
      this.name = name || "";
      this.surname = surname || "";
      this.dateOfBirth = dateOfBirth || "";
      this.address = address || "";
      this.picture = picture || null;
      this.verify = verify || "null";
    }
  }
  
  export default UserProfileDto;
  