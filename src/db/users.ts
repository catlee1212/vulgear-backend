import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  authentication: {
    password: { type: String, required: true, selected: false },
    salt: { type: String, selected: false },
    sessionToken: { type: String, selected: false },
  },
  usedProducts: [
    { productType: String, isUsed: Boolean, amountInStock: Number, id: Number }
  ]
});

export const UserModel = mongoose.model('User', UserSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({
  'authentication.sessionToken': sessionToken,
});
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) => new UserModel(values).save().then((user) => user.toObject());

export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values);

const ProductSchema = new mongoose.Schema({
  productType: { type: String, required: true },
  isUsed: { type: Boolean, default: false },
  amountInStock: { type: Number, default: 0 },
});

export const ProductModel = mongoose.model('Product', ProductSchema);

export const createProduct = (values: Record<string, any>) => new ProductModel(values).save().then((product) => product.toObject());
