import bcrypt from "bcrypt";

export const hasPassword = async (password) => {
  const has = await bcrypt.hash(password, 10);
  return has;
};

export const comparePassword = async (password, hasPassword) => {
  try {
    let checkPassword = await bcrypt.compare(password, hasPassword);
    return checkPassword;
  } catch (error) {
    console.log("Password compare error", error);
    return false;
  }
};
