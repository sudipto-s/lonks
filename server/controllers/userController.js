import User from "../models/User.js"

export const getUsers = async (req, res) => {
   try {
      const response = await User.find()
      if (!response)
         return res.status(404).send("No users found")
      res.status(200).send(response)
   } catch (err) {
      res.status(500).send({ message: err.message })
   }
}

export const createUsers = async (req, res) => {
   const { username, email, password } = req.body

   try {
      const response = await User.create({username, email, password})
      res.status(201).send(response)
   } catch (err) {
      res.status(500).send({ message: err.message })
   }
}

export const updateUsers = async (req, res) => {
   const { username, newUsername } = req.body

   try {
      const response = await User.findOneAndUpdate({ username }, { $set: { username: newUsername }})
      if (!response)
         return res.status(404).send("User not found")
      res.status(200).send(response)
   } catch (err) {
      res.status(500).send({ message: err.message })
   }
}

export const deleteUsers = async (req, res) => {
   const { username } = req.params

   try {
      const response = await User.findOneAndDelete({ username })
      if (!response)
         return res.status(404).send("User not found")
      res.status(200).send(response)
   } catch (err) {
      res.status(500).send({ message: err.message })
   }
}