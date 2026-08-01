require("dotenv").config();
const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const mongoose = require("mongoose");
const Complaint = require("./models/Complaint");
const User = require("./models/User");

const seedComplaints = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB successfully.");

    // Find admin or officer users to assign
    const officer = await User.findOne({ role: "officer" });
    const citizen = await User.findOne({ role: "citizen" });

    const sampleComplaints = [
      {
        title: "Broken Streetlight on Main Street",
        description: "The streetlight near house #42 has been non-functional for 3 days, causing visibility issues at night.",
        category: "Street Light",
        location: "MG Road, Sector 4, City Center",
        status: "Pending",
        citizen: citizen ? citizen._id : null,
      },
      {
        title: "Deep Pothole near Bus Station",
        description: "Dangerous pothole in the middle of the lane causing traffic jams and potential accidents.",
        category: "Roads & Highways",
        location: "Central Bus Station Gate 2",
        status: "In Progress",
        officer: officer ? officer._id : null,
        citizen: citizen ? citizen._id : null,
        remarks: [
          { text: "Inspection team dispatched to evaluate road damage.", officer: "Officer Sharma", timestamp: new Date() }
        ]
      },
      {
        title: "Garbage Pile Overflow",
        description: "Commercial waste bin overflowing near the local market area for over 48 hours.",
        category: "Waste Management",
        location: "Market Square, North Block",
        status: "Resolved",
        officer: officer ? officer._id : null,
        citizen: citizen ? citizen._id : null,
        remarks: [
          { text: "Sanitation crew cleared the area and sanitized the bin.", officer: "Officer Sharma", timestamp: new Date() }
        ]
      },
      {
        title: "Water Pipeline Leakage",
        description: "Clean drinking water leaking continuously from underground pipe on 5th Avenue.",
        category: "Water Supply",
        location: "5th Avenue, Park View Colony",
        status: "Assigned",
        officer: officer ? officer._id : null,
        citizen: citizen ? citizen._id : null,
      },
      {
        title: "Clogged Drainage Pipe",
        description: "Stormwater drain blocked with debris, leading to waterlogging during rain.",
        category: "Drainage",
        location: "Subhash Nagar, Ward 12",
        status: "Pending",
        citizen: citizen ? citizen._id : null,
      },
      {
        title: "Hazardous Tree Branch Hanging",
        description: "Large tree branch cracked and hanging low over public walkway near school entrance.",
        category: "Public Safety",
        location: "St. Xavier School Road",
        status: "Resolved",
        officer: officer ? officer._id : null,
        citizen: citizen ? citizen._id : null,
        remarks: [
          { text: "Horticulture team trimmed and cleared dangerous branch.", officer: "Officer Sharma", timestamp: new Date() }
        ]
      },
      {
        title: "Flickering Signal Lights",
        description: "Traffic signal lights at crossroad turning off intermittently during peak hours.",
        category: "Traffic Control",
        location: "Ring Road Junction",
        status: "In Progress",
        officer: officer ? officer._id : null,
        citizen: citizen ? citizen._id : null,
      }
    ];

    await Complaint.deleteMany({});
    console.log("Cleared existing test complaints.");

    const inserted = await Complaint.insertMany(sampleComplaints);
    console.log(`Successfully seeded ${inserted.length} sample complaints into MongoDB database!`);

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding complaints:", error);
    process.exit(1);
  }
};

seedComplaints();
