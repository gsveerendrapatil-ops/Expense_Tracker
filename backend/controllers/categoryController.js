import Category from "../models/categoryModel.js";

// GET CATEGORIES
export const getCategories = async (req, res) => {
  try {
    const type = req.query.type;

    const filter = {
      user: req.user.id,
      status: true,
    };

    if (type === "income" || type === "expense") {
      filter.type = type;
    }

    const categories = await Category.find(filter).sort({
      name: 1,
    });

    res.status(200).json(categories);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load categories",
    });
  }
};

// CREATE CATEGORY
export const createCategory = async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({
        message: "Invalid category type",
      });
    }

    const category = await Category.create({
      name: name.trim(),
      type,
      user: req.user.id,
    });

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Category already exists",
      });
    }

    res.status(500).json({
      message: "Failed to create category",
    });
  }
};

// UPDATE CATEGORY
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    const category = await Category.findOneAndUpdate(
      {
        _id: id,
        user: req.user.id,
      },
      {
        name: name.trim(),
      },
      {
        new: true,
      },
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Category already exists",
      });
    }

    res.status(500).json({
      message: "Failed to update category",
    });
  }
};

// DELETE CATEGORY
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete category",
    });
  }
};