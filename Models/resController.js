const express = require("express");
const router = express.Router();
const restModel = require("../Models/resModel");
const validateToken = require("../middleWares/validateToken");
const admin = require("../middleWares/admin");

router.post("/create-restaurant", validateToken, admin, async (req, res) => {
  try {
    const rest = await restModel.create(req.body);
    console.log(rest);
    return res
      .status(201)
      .json({ message: "Restaurant Created Successfully...", rest });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put("/edit-restaurant/:id", validateToken, admin, async (req, res) => {
  try {
    const rest = await restModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true, 
      runValidators: true, 
    });
    if (!rest) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    return res.json({
      data: rest,
      message: "Restaurant Updated Successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/get-restaurant", async (req, res) => {
  try {
    const rest = await restModel.find();
    return res.json({
      data: rest,
      message: "Restaurants Fetched Successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/get-restaurant/:id", async (req, res) => {
  try {
    const rest = await restModel.findById(req.params.id);
    return res.json({
      data: rest,
      message: "Restaurants Fetched Successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
router.delete(
  "/delete-restaurant/:id",
  validateToken,
  admin,
  async (req, res) => {
    try {
      await restModel.findByIdAndDelete(req.params.id);
      return res.json({ message: "Event Deleted Successfully" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);
module.exports = router;
