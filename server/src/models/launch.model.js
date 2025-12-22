import mongoose from "mongoose";

const LaunchSchema = new mongoose.Schema({
    name: { type: String, required: true },     // e.g., "Falcon 9 | Starlink"
    net: { type: Date, required: true },        // "No Earlier Than" (Launch Time)
    status: { type: String },                   // "Go", "TBD", "Hold"
    agency: { type: String },                   // "SpaceX", "NASA"
    rocketImage: { type: String },              // URL to the rocket image
    vidURL: { type: String },
},
{
    timestamps: true
})
export default mongoose.model("Launch", LaunchSchema);