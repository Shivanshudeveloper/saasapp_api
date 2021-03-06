const express = require("express");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const router = express.Router();
const stripe = require("stripe")(
  "sk_test_51IdwfeH8KzFo5uc9YHKzp2HOPkZJvH0ij0qhWeg0wQ17G73o5fVJYjMkWOfAmWUgjVZe0DesJvrQKbmAPSacXsVP00qMXnEqFr"
);
const { v4: uuidv4 } = require("uuid");
// Getting Module

const Products_Model = require("../models/Products");
const MainStore_Model = require("../models/MainStore");
const Cart_Model = require("../models/Cart");
const Contact_Model = require("../models/Contact");
const Company_Model = require("../models/Company");
const Template_Model = require("../models/Templates");
const Snippet_Model = require("../models/Snippet");
const Task_Model = require("../models/Task");
const Sequence_Model = require("../models/Sequences");
const User_Model = require("../models/Users");

function isNumeric(str) {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

//
router.post("/addcontact", async (req, res) => {
  const formData = req.body;
  const newContact = new Contact_Model({
    ...formData,
  });

  try {
    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

//
router.patch("/editcontact", async (req, res) => {
  const formData = req.body;
  try {
    await Contact_Model.findByIdAndUpdate(formData._id, formData, {
      new: true,
      useFindAndModify: false,
    });
    res.status(201).json({ message: "Updated" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

router.get("/getallcontact", async (req, res) => {
  try {
    const allContacts = await Contact_Model.find({});
    res.status(201).json(allContacts);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

router.post("/searchcontact", async (req, res) => {
  try {
    const { searchQuery } = req.body;
    const s1 = new RegExp(searchQuery, "i");
    const allContacts = await Contact_Model.find({
      $or: [{ fName: s1 }, { lName: s1 }],
    });
    res.status(201).json(allContacts);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

router.get("/getcontact/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const contact = await Contact_Model.find({ _id: id });
    res.status(201).json(contact);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});
router.delete("/deletecontact/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Contact_Model.findByIdAndDelete(id);
    res.status(201).json({ message: "Deleted" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

router.get("/getcompany/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company_Model.find({ _id: id });
    res.status(201).json(company);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});
router.delete("/deletecompany/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Company_Model.findByIdAndDelete(id);
    res.status(201).json({ message: "Deleted" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

router.patch("/editcompany", async (req, res) => {
  const formData = req.body;
  try {
    await Company_Model.findByIdAndUpdate(formData._id, formData, {
      new: true,
      useFindAndModify: false,
    });
    res.status(201).json({ message: "Updated" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

router.post("/filtercontact", async (req, res) => {
  try {
    const { filterQuery } = req.body;
    const s1 = new RegExp(
      filterQuery.contact === "" ? "none" : filterQuery.contact,
      "i"
    );
    const s2 = new RegExp(
      filterQuery.company === "" ? "none" : filterQuery.company,
      "i"
    );
    const s3 = new RegExp(
      filterQuery.location === "" ? "none" : filterQuery.location,
      "i"
    );
    const allContacts = await Contact_Model.find({
      $or: [{ fName: s1 }, { lName: s1 }, { company: s2 }, { state: s3 }],
    });
    res.status(201).json(allContacts);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});
router.post("/filtercompany", async (req, res) => {
  try {
    const { filterQuery } = req.body;
    console.log(filterQuery);
    const s1 = new RegExp(
      filterQuery.company === "" ? "none" : filterQuery.company,
      "i"
    );
    const s2 = new RegExp(
      filterQuery.industry === "" ? "none" : filterQuery.industry,
      "i"
    );
    const s3 = new RegExp(
      filterQuery.location === "" ? "none" : filterQuery.location,
      "i"
    );
    const s4 = new RegExp(
      filterQuery.technologies === "" ? "none" : filterQuery.technologies,
      "i"
    );
    const allCompanies = await Company_Model.find({
      $or: [{ fullName: s1 }, { industry: s2 }, { state: s3 }, { about: s4 }],
    });
    res.status(201).json(allCompanies);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

router.post("/searchcompany", async (req, res) => {
  try {
    const { searchQuery } = req.body;
    const s1 = new RegExp(searchQuery, "i");
    const allCompany = await Company_Model.find({
      $or: [{ fullName: s1 }],
    });
    res.status(201).json(allCompany);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

router.post("/addcompany", async (req, res) => {
  const formData = req.body;
  const newCompany = new Company_Model({
    ...formData,
  });

  try {
    await newCompany.save();
    res.status(201).json(newCompany);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

router.get("/getallcompanies", async (req, res) => {
  try {
    const allCompanies = await Company_Model.find({});
    res.status(201).json(allCompanies);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

router.post("/searchtasks", async (req, res) => {
  try {
    const { searchField } = req.body;
    const contact = new RegExp(searchField, "i");
    const allTasks = await Task_Model.find({
      $or: [{ contact }],
    });
    res.status(201).json(allTasks);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

router.post("/savetask", async (req, res) => {
  const { formData, option, value } = req.body;
  switch (value) {
    case 0:
      const newTask0 = new Task_Model({
        contact: formData.contact0,
        notes: formData.notes0,
        date: formData.date0,
        type: option,
        completed: false,
        value,
      });
      try {
        await newTask0.save();
        res.status(201).json(newTask0);
      } catch (error) {
        res.status(409).json({ message: error.message });
      }
      break;
    case 1:
      const newTask1 = new Task_Model({
        contact: formData.contact1,
        notes: formData.notes1,
        result: formData.result1,
        date: formData.date1,
        type: option,
        completed: false,
        value,
      });
      try {
        await newTask1.save();
        res.status(201).json(newTask1);
      } catch (error) {
        res.status(409).json({ message: error.message });
      }
      break;
    case 2:
      const newTask2 = new Task_Model({
        contact: formData.contact2,
        description: formData.desc2,
        date: formData.date2,
        type: option,
        completed: false,
        value,
      });
      try {
        await newTask2.save();
        res.status(201).json(newTask2);
      } catch (error) {
        res.status(409).json({ message: error.message });
      }
      break;
    case 3:
      console.log(formData.date3);
      const newTask3 = new Task_Model({
        contact: formData.contact3,
        description: formData.desc3,
        date: formData.date3,
        action: formData.action3,
        type: option,
        completed: false,
        value,
      });
      try {
        await newTask3.save();
        res.status(201).json(newTask3);
      } catch (error) {
        res.status(409).json({ message: error.message });
      }
      break;
  }
});

router.patch("/edittask", async (req, res) => {
  const { formData, option, value } = req.body;
  try {
    if (value === 0) {
      await Task_Model.findByIdAndUpdate(
        formData.id,
        {
          contact: formData.contact0,
          notes: formData.notes0,
          date: formData.date0,
          type: option,
          completed: false,
          value,
        },
        {
          new: true,
          useFindAndModify: false,
        }
      );
    }
    if (value === 1) {
      await Task_Model.findByIdAndUpdate(
        formData.id,
        {
          contact: formData.contact1,
          notes: formData.notes1,
          result: formData.result1,
          date: formData.date1,
          type: option,
          completed: false,
          value,
        },
        {
          new: true,
          useFindAndModify: false,
        }
      );
    }
    if (value === 2) {
      await Task_Model.findByIdAndUpdate(
        formData.id,
        {
          contact: formData.contact2,
          description: formData.desc2,
          date: formData.date2,
          type: option,
          completed: false,
          value,
        },
        {
          new: true,
          useFindAndModify: false,
        }
      );
    }
    if (value === 3) {
      await Task_Model.findByIdAndUpdate(
        formData.id,
        {
          contact: formData.contact3,
          description: formData.desc3,
          date: formData.date3,
          action: formData.action3,
          type: option,
          completed: false,
          value,
        },
        {
          new: true,
          useFindAndModify: false,
        }
      );
    }
    res.status(201).json({ message: "Updated" });
  } catch (error) {
    console.log(error);
  }
});

router.get("/getalltasks", async (req, res) => {
  try {
    const allTasks = await Task_Model.find().sort({ date: -1 });
    res.status(201).json(allTasks);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

router.get("/getspecifictasks/:type/:status", async (req, res) => {
  const { type, status } = req.params;
  let flag;
  if (status === "completed") flag = true;
  else flag = false;
  try {
    const allTasks = await Task_Model.find({
      type: type,
      completed: flag,
    }).sort({ date: -1 });
    res.status(201).json(allTasks);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

router.get("/getcomingtasks", async (req, res) => {
  newDate = new Date();
  try {
    const allTasks = await Task_Model.find({ completed: false }).sort({
      date: -1,
    });
    res.status(201).json(allTasks);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});
router.get("/getcompletedtasks", async (req, res) => {
  try {
    const allTasks = await Task_Model.find({ completed: true }).sort({
      date: -1,
    });
    res.status(201).json(allTasks);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

router.delete("/deletetask/:id", async (req, res) => {
  const { id: id } = req.params;
  const task = await Task_Model.findByIdAndDelete(id);
  res.json(task);
});

router.patch("/completetask/:id", async (req, res) => {
  try {
    const { id: id } = req.params;
    const updatedTask = await Task_Model.findOneAndUpdate(
      { _id: id },
      { completed: true },
      {
        new: true,
        useFindAndModify: false,
      }
    );
    res.json(updatedTask);
  } catch (error) {
    console.log(error);
  }
});
router.patch("/notcompletetask/:id", async (req, res) => {
  try {
    const { id: id } = req.params;
    const updatedTask = await Task_Model.findOneAndUpdate(
      { _id: id },
      { completed: false },
      {
        new: true,
        useFindAndModify: false,
      }
    );
    res.json(updatedTask);
  } catch (error) {
    console.log(error);
  }
});

router.post("/addtemplate", async (req, res) => {
  const formData = req.body;

  try {
    const newTemplate = new Template_Model({
      ...formData,
      tag: String(formData.tag).split(","),
    });
    await newTemplate.save();
    res.status(201).json(newTemplate);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

router.post("/addtemplatefromexcel", async (req, res) => {
  const finalData = req.body;

  finalData.map(async (data) => {
    try {
      const newTemplate = new Template_Model(data);
      await newTemplate.save();
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  });
  res.status(201).json({ message: "Templates Added" });
});

router.get("/searchonetemplate/:id", async (req, res) => {
  const { id: id } = req.params;
  const template = await Template_Model.find({ _id: id });
  res.json(template);
});

router.patch("/edittemplate", async (req, res) => {
  const formData = req.body;
  const template = await Template_Model.findOneAndUpdate(
    { _id: formData._id },
    { ...formData, tag: formData.tag.split(",") },
    {
      new: true,
      useFindAndModify: false,
    }
  );
  res.json({ message: "Template Edited" });
});

router.patch("/addtagtotemplate", async (req, res) => {
  const { tag, selected, type } = req.body;

  const promiseArray = selected.map(async (each) => {
    return new Promise(async (resolve, reject) => {
      const template = await Template_Model.find({ _id: each });
      await template[0].tag.push(tag);
      await Template_Model.findByIdAndUpdate(each, template[0], {
        new: true,
        useFindAndModify: false,
      });
      return resolve();
    });
  });
  Promise.all(promiseArray).then(async () => {
    try {
      const allTemplates = await Template_Model.find({ type: type });
      res.status(201).json(allTemplates);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  });
});

router.patch("/removetagfromtemplate", async (req, res) => {
  const { tag, selected, type } = req.body;
  const promiseArray = selected.map(async (each) => {
    return new Promise(async (resolve, reject) => {
      const template = await Template_Model.find({ _id: each });
      template[0].tag = template[0].tag.filter((t) => t !== String(tag));
      await Template_Model.findByIdAndUpdate(each, template[0], {
        new: true,
        useFindAndModify: false,
      });
      return resolve();
    });
  });
  Promise.all(promiseArray).then(async () => {
    try {
      const allTemplates = await Template_Model.find({ type: type });
      res.status(201).json(allTemplates);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  });
});
router.patch("/addtagtosnippet", async (req, res) => {
  const { tag, selected, type } = req.body;

  const promiseArray = selected.map(async (each) => {
    return new Promise(async (resolve, reject) => {
      const template = await Snippet_Model.find({ _id: each });
      await template[0].tag.push(tag);
      await Snippet_Model.findByIdAndUpdate(each, template[0], {
        new: true,
        useFindAndModify: false,
      });
      return resolve();
    });
  });
  Promise.all(promiseArray).then(async () => {
    try {
      const allTemplates = await Snippet_Model.find({ type: type });
      res.status(201).json(allTemplates);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  });
});

router.patch("/removetagfromsnippet", async (req, res) => {
  const { tag, selected, type } = req.body;
  const promiseArray = selected.map(async (each) => {
    return new Promise(async (resolve, reject) => {
      const template = await Snippet_Model.find({ _id: each });
      template[0].tag = template[0].tag.filter((t) => t !== String(tag));
      await Snippet_Model.findByIdAndUpdate(each, template[0], {
        new: true,
        useFindAndModify: false,
      });
      return resolve();
    });
  });
  Promise.all(promiseArray).then(async () => {
    try {
      const allTemplates = await Snippet_Model.find({ type: type });
      res.status(201).json(allTemplates);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  });
});

router.get("/getalltemplates/:type", async (req, res) => {
  const { type: type } = req.params;
  try {
    const allTemplates = await Template_Model.find({
      type: type,
      archive: false,
    });
    res.status(201).json(allTemplates);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

router.post("/searchtemplate", async (req, res) => {
  try {
    const { searchQuery: name, type, archivestatus } = req.body;
    const s1 = new RegExp(name, "i");
    const allTemplates = await Template_Model.find({
      $or: [{ name: s1, type, archive: archivestatus }],
    });
    res.status(201).json(allTemplates);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

router.post("/deletetemplate", async (req, res) => {
  const selected = req.body;
  const promiseArray = selected.map(async (each) => {
    return new Promise(async (resolve, reject) => {
      await Template_Model.findByIdAndDelete(each);
      return resolve();
    });
  });
  Promise.all(promiseArray).then(async () => {
    try {
      res.status(200).json(selected);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  });
});

// SNIPPETS

router.post("/searchsnippet", async (req, res) => {
  try {
    const { searchQuery: name, type } = req.body;
    const allSnippets = await Snippet_Model.find({
      $or: [
        {
          name,
          type,
        },
      ],
    });
    res.status(201).json(allSnippets);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

router.post("/deletesnippet", async (req, res) => {
  const selected = req.body;
  const promiseArray = selected.map(async (each) => {
    return new Promise(async (resolve, reject) => {
      await Snippet_Model.findByIdAndDelete(each);
      return resolve();
    });
  });
  Promise.all(promiseArray).then(async () => {
    try {
      res.status(200).json(selected);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  });
});

router.post("/addsnippet", async (req, res) => {
  const formData = req.body;
  const newSnippet = new Snippet_Model({
    ...formData,
    tag: formData.tag.split(","),
    archive: false,
  });

  try {
    await newSnippet.save();
    res.status(201).json(newSnippet);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

router.get("/searchonesnippet/:id", async (req, res) => {
  const { id: id } = req.params;
  const snippet = await Snippet_Model.find({ _id: id });
  res.json(snippet);
});

router.patch("/editsnippet", async (req, res) => {
  const formData = req.body;
  const snippet = await Snippet_Model.findOneAndUpdate(
    { _id: formData._id },
    { ...formData, tag: formData.tag.split(",") },
    {
      new: true,
      useFindAndModify: false,
    }
  );
  res.json({ message: "Snippet Edited" });
});

router.get("/getallsnippets/:type", async (req, res) => {
  const { type: type } = req.params;
  try {
    const allCompanies = await Snippet_Model.find({
      type: type,
      archive: false,
    });
    res.status(201).json(allCompanies);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

// TEST
// @GET TEST
// GET
router.get("/test", (req, res) => {
  res.send("Working");
});

// Database CRUD Operations
// @POST Request to GET the People
// GET
router.get("/getallproductapi", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  Products_Model.find({})
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

// Database CRUD Operations
// @POST Request to GET the People
// GET
router.get("/getallproductsmainstorefilters/:filter", (req, res) => {
  const { filter } = req.params;
  res.setHeader("Content-Type", "application/json");
  MainStore_Model.find({ gender: filter })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

// Database CRUD Operations
// @POST Request to GET the Product Details
// GET
router.get("/getproductitemdetails/:id", (req, res) => {
  const { id } = req.params;
  res.setHeader("Content-Type", "application/json");
  MainStore_Model.find({ _id: id })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

// Database CRUD Operations
// @POST Request to GET the People
// GET
router.get("/getallproductsapifilters/:filter", (req, res) => {
  const { filter } = req.params;
  res.setHeader("Content-Type", "application/json");
  Products_Model.find({ Gender: filter })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

// Database CRUD Operations
// @POST Request to GET the People
// GET
router.get("/getcartallitems/:userId", (req, res) => {
  const { userId } = req.params;
  res.setHeader("Content-Type", "application/json");
  Cart_Model.find({ userId, completed: false, payment: false, inCart: true })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

// Database CRUD Operations
// @POST Request to GET the People
// GET
router.get("/gettrackallitems/:userId", (req, res) => {
  const { userId } = req.params;
  res.setHeader("Content-Type", "application/json");
  Cart_Model.find({ userId, completed: false, payment: true })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

// Database CRUD Operations
// @POST Request to GET the People
// GET
router.get(
  "/getallproductapicategory/:ParentCategory/:Category/:Brand",
  (req, res) => {
    const { ParentCategory, Category, Brand } = req.params;
    res.setHeader("Content-Type", "application/json");
    Products_Model.find({ ParentCategory, Category, Brand })
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => res.status(400).json(`Error: ${err}`));
  }
);

router.post("/searchtask", async (req, res) => {
  const { contact, type, status } = req.body;
  try {
    const contactr = new RegExp(contact, "i");
    const typer = new RegExp(type, "i");
    const newStatus =
      status === "none"
        ? null
        : status.toUpperCase() === "COMPLETED"
        ? true
        : false;

    const tasks = await Task_Model.find({
      $or: [{ contact: contactr }, { type: typer }, { completed: newStatus }],
    });
    res.status(200).json(tasks);
    // console.log(tasks);
  } catch (error) {
    console.log(error);
  }
});
router.post("/filtersnippet", async (req, res) => {
  const { name, desc, tag, type } = req.body;
  try {
    const namer = new RegExp(name, "i");
    const descr = new RegExp(desc, "i");
    const snippets = await Snippet_Model.find({
      $or: [{ name: namer }, { description: descr }, { tag: { $in: tag } }],
      type: type,
    });
    res.status(200).json(snippets);
  } catch (error) {
    console.log(error);
  }
});
router.post("/filtertemplate", async (req, res) => {
  const { name, desc, tag, type } = req.body;
  try {
    const namer = new RegExp(name, "i");
    const descr = new RegExp(desc, "i");
    const templates = await Template_Model.find({
      $or: [{ name: namer }, { subject: descr }, { tag: { $in: tag } }],
      type: type,
    });
    res.status(200).json(templates);
  } catch (error) {
    console.log(error);
  }
});

router.get("/getallsnippestfortemplates", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  Snippet_Model.find({})
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.get("/getalltags", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  var allTagsaArr = [];
  Snippet_Model.find({}, { tag: 1 })
    .then((data) => {
      data.map((d) => {
        var newTag = d.tag;
        newTag.map((t) => {
          allTagsaArr.push({ t });
        });
      });
      res.status(200).json(allTagsaArr);
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.get("/getalltagstemplates", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  var allTagsaArr = [];
  Template_Model.find({}, { tag: 1 })
    .then((data) => {
      data.map((d) => {
        var newTag = d.tag;
        newTag.map((t) => {
          allTagsaArr.push({ t });
        });
      });
      res.status(200).json(allTagsaArr);
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.post("/archivesnippet", async (req, res) => {
  const selected = req.body;
  res.setHeader("Content-Type", "application/json");

  selected.map((s) => {
    Snippet_Model.findOne({ _id: s })
      .then((data) => {
        let a = data.archive;
        Snippet_Model.findOneAndUpdate(
          { _id: s },
          { archive: !a },
          { useFindAndModify: false }
        )
          .then(() => {
            res.status(200).json("Added Archive");
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  });
});

router.get("/getallsnippetsarchive/:type", async (req, res) => {
  const { type: type } = req.params;
  try {
    const allCompanies = await Snippet_Model.find({
      type: type,
      archive: true,
    });
    res.status(201).json(allCompanies);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

router.get("/getalltemplatesarchive/:type", async (req, res) => {
  const { type: type } = req.params;
  try {
    const allCompanies = await Template_Model.find({
      type: type,
      archive: true,
    });
    res.status(201).json(allCompanies);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

router.post("/archivetemplates", async (req, res) => {
  const selected = req.body;
  res.setHeader("Content-Type", "application/json");

  selected.map((s) => {
    Template_Model.findOne({ _id: s })
      .then((data) => {
        let a = data.archive;
        Template_Model.findOneAndUpdate(
          { _id: s },
          { archive: !a },
          { useFindAndModify: false }
        )
          .then(() => {
            res.status(200).json("Added Archive");
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  });
});

//SEQUENCES

router.get("/getprospect/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const sequence = await Sequence_Model.findById(id);
    res.status(201).json(sequence);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});
router.post("/addprospect/:id", async (req, res) => {
  const { id } = req.params;
  const formData = req.body;
  try {
    const sequence = await Sequence_Model.findById(id);
    sequence.prospects.push(formData);
    const updatedSequence = await Sequence_Model.findByIdAndUpdate(
      id,
      sequence,
      {
        new: true,
        useFindAndModify: false,
      }
    );
    res.status(201).json({ message: "Updated" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

router.post("/newsequence", async (req, res) => {
  const newSequence = new Sequence_Model();
  try {
    await newSequence.save();
    res.status(201).json({ id: newSequence._id });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

router.post("/addtasksequence", async (req, res) => {
  const { formData, option, value, sequenceId } = req.body;
  const sequence = await Sequence_Model.findById(sequenceId);
  console.log(sequence);
  switch (value) {
    case 0:
      const newTask0 = {
        type: formData.type0,
        run: formData.run0,
        checked: formData.checked0,
        time: formData.time0,
        templateName: formData.templateName0,
        templateDesc: formData.templateDesc0,
        option: option,
        value,
        stepNo: sequence.steps.length + 1,
      };
      try {
        sequence.steps.push(newTask0);
        await sequence.save();
        console.log(sequence);
        res.status(201).json(sequence);
      } catch (error) {
        res.status(409).json({ message: error.message });
      }
      break;
    case 1:
      const newTask1 = {
        instruction: formData.instruction1,
        run: formData.run1,
        priority: formData.priority1,
        checked: formData.checked1,
        time: formData.time1,
        option: option,
        value,
        stepNo: sequence.steps.length + 1,
      };
      try {
        sequence.steps.push(newTask1);
        await sequence.save();
        console.log(sequence);
        res.status(201).json(sequence);
      } catch (error) {
        res.status(409).json({ message: error.message });
      }
      break;
    case 2:
      const newTask2 = {
        type: formData.type2,
        notes: formData.notes2,
        run: formData.run2,
        checked: formData.checked2,
        time: formData.time2,
        priority: formData.priority2,
        option: option,
        value,
        stepNo: sequence.steps.length + 1,
      };
      try {
        sequence.steps.push(newTask2);
        await sequence.save();
        console.log(sequence);
        res.status(201).json(sequence);
      } catch (error) {
        res.status(409).json({ message: error.message });
      }
      break;
    case 3:
      const newTask3 = {
        type: formData.type3,
        notes: formData.notes3,
        run: formData.run3,
        checked: formData.checked3,
        time: formData.time3,
        priority: formData.priority3,
        option: option,
        value,
        stepNo: sequence.steps.length + 1,
      };
      try {
        sequence.steps.push(newTask3);
        await sequence.save();
        console.log(sequence);
        res.status(201).json(sequence);
      } catch (error) {
        res.status(409).json({ message: error.message });
      }
      break;
    case 4:
      const newTask4 = {
        type: formData.type4,
        message: formData.message4,
        run: formData.run4,
        checked: formData.checked4,
        time: formData.time4,
        option: option,
        value,
        stepNo: sequence.steps.length + 1,
      };
      try {
        sequence.steps.push(newTask4);
        await sequence.save();
        console.log(sequence);
        res.status(201).json(sequence);
      } catch (error) {
        res.status(409).json({ message: error.message });
      }
      break;
  }
});
router.get("/gettasksequence/:id", async (req, res) => {
  const { id } = req.params;
  if (id !== undefined)
    try {
      const sequence = await Sequence_Model.findById(id);
      res.status(201).json(sequence);
    } catch (err) {
      console.log(err);
    }
  else {
    res.status(404);
  }
});
router.delete("/deletesequence/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Sequence_Model.findByIdAndDelete(id);
    res.status(201).json({ message: "Deleted" });
  } catch (err) {
    res.status(404).json({ error: "Error" });
    // console.log(err);
  }
});

router.get("/getallsequence", async (req, res) => {
  const sequence = await Sequence_Model.find();
  res.status(201).json(sequence);
});

// //////////////
// USER DETAILS
// ///////////////

router.get("/getdetails/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const userDetails = await User_Model.find({ userId: id });
    res.status(201).json(userDetails);
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
});

router.post("/adddetails", async (req, res) => {
  const formData = req.body;
  try {
    const newUser = new User_Model(formData);
    await newUser.save();
    res.status(201).json({ message: newUser });
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
});
router.post("/editdetails", async (req, res) => {
  const formData = req.body;
  try {
    const newUser = await User_Model.findByIdAndUpdate(
      { _id: formData._id },
      formData,
      { useFindAndModify: false }
    );
    res.status(201).json({ message: newUser });
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
});

// //////////////////
// Schedule Event
// //////////////////

// async function getDet() {
//   const sequence = await Sequence_Model.find();
//   const currentDay = new Date().getDay();
//   const currentTime = new Date().getHours();

//   cron.schedule("* * * * *", function () {
//     console.log("--------");
//     sequence[0].steps.map(async (seq) => {
//       if (String(currentDay) === String(seq.run - 1)) {
//         if (seq?.time === undefined) {
//           console.log("Today", seq?.option);
//         } else {
//           // console.log("Today ", seq?.option, " at ", seq?.time.split(":")[0]);
//           // if (seq?.time.split(":")[0] === currentTime) {
//           const userEmails = await Sequence_Model.findById(sequence[0]._id);
//           if (seq.option === "Email") {
//             // userEmails.map((person) => {
//             //   console.log(person.email);
//             // });
//             // try {
//             //   (transporter = nodemailer.createTransport({
//             //     service: "gmail",
//             //     auth: {
//             //       user: "evencloudupload@gmail.com",
//             //       pass: "Evencloud@1234",
//             //     },
//             //   })),
//             //     (mailOption = {
//             //       from: "evencloudupload@gmail.com",
//             //       to: "",
//             //       subject: seq?.templateName,
//             //       html: seq?.templateDesc,
//             //     }),
//             //     transporter.sendMail(mailOption, (err, data) => {
//             //       console.log("Email Sent!");
//             //     });
//             // } catch (error) {
//             //   console.log(error);
//             // }
//           }
//           // }
//         }
//       }
//     });
//     console.log("********");
//     console.log("");
//   });
// }

async function getDet1() {
  const sequence = await Sequence_Model.find();
  const currentDay = new Date().getDay();
  const currentTime = new Date().getHours();

  cron.schedule("0 * * * *", function () {
    sequence[2].prospects.map(async (seq) => {
      if (String(currentDay) === String(seq?.type?.run - 1)) {
        // console.log(userDetails[0].emails);

        if (seq?.type?.time.split(":")[0] === String(currentTime)) {
          if (seq?.type?.option === "Email") {
            const userDetails = await User_Model.find();
            let password = "";
            userDetails.map((user) => {
              if (user.email === seq?.email) password = user.password;
            });
            try {
              (transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user: seq?.email,
                  pass: password,
                },
              })),
                (mailOption = {
                  from: seq?.email,
                  to: seq?.contact?.email,
                  subject: seq?.type?.templateName,
                  html: seq?.type?.templateDesc,
                }),
                transporter.sendMail(mailOption, (err, data) => {
                  console.log("Email Sent!");
                });
            } catch (error) {
              console.log(error);
            }
          }
        }
      }
    });
    console.log("********");
  });
}

getDet1();

router.post("/testsequence", async (req, res) => {
  const { testData } = req.body;

  const sequence = await Sequence_Model.find();

  let i = 0;
  cron.schedule(`*/${Number(testData)} * * * *`, function () {
    if (i < 3) {
      sequence[2].prospects.map(async (seq) => {
        if (seq?.type?.option === "Email") {
          const userDetails = await User_Model.find();
          let password = "";
          userDetails.map((user) => {
            if (user.email === seq?.email) password = user.password;
          });
          try {
            (transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: seq?.email,
                pass: password,
              },
            })),
              (mailOption = {
                from: seq?.email,
                to: seq?.contact?.email,
                subject: seq?.type?.templateName,
                html: seq?.type?.templateDesc,
              }),
              transporter.sendMail(mailOption, (err, data) => {
                console.log("Email Sent!");
              });
          } catch (error) {
            console.log(error);
          }
        }
      });
      i = i + 1;
      console.log("--------", i);
    } else {
      return res.status(201);
    }
  });
});

module.exports = router;
