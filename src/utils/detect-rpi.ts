import fs from "fs";

const PI_MODEL_NO = [
  // https://www.raspberrypi.org/documentation/hardware/raspberrypi/
  "BCM2708",
  "BCM2709",
  "BCM2710",
  "BCM2835", // Raspberry Pi 1 and Zero
  "BCM2836", // Raspberry Pi 2
  "BCM2837", // Raspberry Pi 3 (and later Raspberry Pi 2)
  "BCM2837B0", // Raspberry Pi 3B+ and 3A+
  "BCM2711" // Raspberry Pi 4B
];

function isPiByModel (model: string) {
  return PI_MODEL_NO.indexOf(model) > -1;
}

export function isPi(): boolean {
  let cpuInfo;
  try {
    cpuInfo = fs.readFileSync("/proc/cpuinfo", { encoding: "utf8" });
  } catch (e) {
    // if this fails, this is probably not a pi
    return false;
  }

  const model = cpuInfo
    .split("\n")
    .map((line: string) => line.replace(/\t/g, ""))
    .filter((line: string) => line.length > 0)
    .map((line: string) => line.split(":"))
    .map((pair: string[]) => pair.map(entry => entry.trim()))
    .filter((pair: string[]) => pair[0] === "Hardware");
  
  if(!model || model.length == 0) {
    return false;
  } 
	
  const number = model[0][1];
  return isPiByModel(number);
}



