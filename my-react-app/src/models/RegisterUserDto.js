class RegisterUserDto {
    constructor(id, username, password, email, name, surname, dateOfBirth, userType, address, pictureFromForm) {
      this.id = id || 0;
      this.username = username || '';
      this.password = password || '';
      this.email = email || '';
      this.name = name || '';
      this.surname = surname || '';
      this.dateOfBirth = dateOfBirth || '';
      this.userType = userType || '';
      this.address = address || '';
      this.pictureFromForm = pictureFromForm || null;
    }
  }

export default RegisterUserDto;