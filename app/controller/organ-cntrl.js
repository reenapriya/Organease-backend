const Organ = require("../models/organ-model");
const Category = require("../models/category-models");
const CentreProfile = require("../models/Centre-model");
const { validationResult } = require("express-validator");

const organCtrl = {};

organCtrl.create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { oid } = req.params;
        const body = req.body;

        console.log("oid", oid)

        // Find the Centre Profile associated with the user
        const centreProfile = await CentreProfile.findOne({ userId: req.user._id });
        if (!centreProfile) {
            return res.status(404).json({ error: "Centre Profile not found" });
        }

        // Find the category based on oid
        const category = await Category.findOne({ _id: oid, cid: centreProfile._id });
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        console.log("preserveSDate:", body.date?.preserveSDate);
        console.log("preserveEDate:", body.date?.preserveEDate);;


        const organ = new Organ({
            dName: body.dName,
            dAge: body.dAge,
            dWeight: body.dWeight,
            bloodType: body.bloodType,
            organName: category.catName,  // Using catName from the category
            oprice: body.oprice,
            secretCode:body.secretCode,
            //oCertificate: body.oCertificate,
            status: body.status,
            date: {
                preserveSDate: body.date ? new Date(body.date.preserveSDate) : undefined,
                preserveEDate: body.date ? new Date(body.date.preserveEDate) : undefined,
            },
            cid: centreProfile._id,  // Use the centre profile ID
            oid
        });

        await organ.save();
        return res.status(201).json(organ);

    } catch (e) {
        console.log(e);
        return res.status(500).json("Internal server error");
    }
};





organCtrl.showOne = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { cid,oid, id } = req.params;  // id here refers to the organ ID
        
        console.log("User ID:", req.user._id);
        console.log("centreid",cid)

        // const centreProfile = await CentreProfile.findOne({  userId: req.user._id });
        // if (!centreProfile) {
        //     return res.status(404).json({ error: "Centre Profile not found" });
        // }
        // console.log("Centre Profile:", centreProfile);
        // // Find the organ based on its ID
        const category = await Category.findOne({ _id: oid });
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        console.log("Category:", category);

        const organ = await Organ.findOne({ _id: id, oid: category._id })
       

        if (!organ) {
            return res.status(404).json({ error: "Organ not found" });
        }

        return res.status(200).json(organ);
    } catch (e) {
        console.log(e);
        return res.status(500).json("Internal server error");
    }
};

organCtrl.myshow = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { oid } = req.params;  // cid is the Centre Profile ID, oid is the Category ID

        console.log("User ID:", req.user._id);

        // Find the Centre Profile associated with the user (optional validation)
        const centreProfile = await CentreProfile.findOne({ userId: req.user._id });
        if (!centreProfile) {
            return res.status(404).json({ error: "Centre Profile not found" });
        }
        // Find the category to ensure it exists
        const category = await Category.findOne({ _id: oid, cid: centreProfile._id });
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        // Find all organs that belong to this category and centre
        const organs = await Organ.find({ cid: centreProfile._id, oid: category._id });

        if (!organs.length) {
            return res.status(404).json({ error: "No organs found for this category and centre" });
        }

        return res.status(200).json(organs);
    } catch (e) {
        console.log(e);
        return res.status(500).json("Internal server error");
    }
};

organCtrl.update = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { oid, id } = req.params;
        const body = req.body;

        // Logging parameters for debugging

        console.log("Category ID:", oid);
        console.log("Organ ID:", id);

        // Find the Centre Profile associated with the user and cid
        const centreProfile = await CentreProfile.findOne({ userId: req.user._id, });
        if (!centreProfile) {
            return res.status(404).json({ error: "Centre Profile not found" });
        }

        // Find the category based on oid and cid
        const category = await Category.findOne({ _id: oid, cid: centreProfile._id });
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        // Update the organ details 
        const updatedOrgan = await Organ.findOneAndUpdate(
            { _id: id, oid: category._id },

            body,
            { new: true, runValidators: true }
        );


        if (!updatedOrgan) {
            return res.status(404).json({ error: "Organ not found" });
        }



        if (body.organName) {
            // Ensure `organs` field is present and is an array
            category.catName = body.organName;
            await category.save();
        }



        return res.status(200).json(updatedOrgan);

    } catch (e) {
        console.log(e);
        return res.status(500).json("Internal server error");
    }
};

organCtrl.remove = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { oid, id } = req.params;
        const body = req.body;


        console.log("Category ID:", oid);
        console.log("Organ ID:", id);
        // Find the Centre Profile associated with the user and cid
        const centreprofile = await CentreProfile.findOne({ userId: req.user._id, });
        if (!centreprofile) {
            return res.status(404).json({ error: "Centre Profile not found" });
        }

        // Find the category based on oid and cid
        const category = await Category.findOne({ _id: oid, cid: centreprofile._id });
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        // Update the organ details 
        const removeOrgan = await Organ.findOneAndDelete(
            { _id: id,cid:centreprofile._id },);

        if (!removeOrgan) {
            return res.status(404).json({ error: "Organ not found" });
        }

        return res.status(200).json(removeOrgan);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json("Internal server error");
    }
};




organCtrl.mysearchget = async (req, res) => {
    try {
        const search = req.query.organ || "";
        const searchQuery = { organName: { $regex: search, $options: "i" } };
        const organSearch = await Organ.find(searchQuery);

        if (organSearch.length > 0) {
            return res.status(200).json(organSearch);
        } else {
            return res.status(404).json({ message: "No organs found matching the search criteria." });
        }
    } catch (error) {
        // Log the error for debugging
        console.error("Error fetching organs:", error.message);

        // Return a server error response
        res.status(500).json({ message: error.message });
    }
};



module.exports = organCtrl;





















