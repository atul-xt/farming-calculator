import React from "react";
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { useSelector } from "react-redux";

const MainSection = () => {
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [records, setRecords] = useState([]);
  const [activeTab, setActiveTab] = useState("calculator");

  // Form states
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    // Calculate total amount whenever hours, minutes, or hourlyRate changes
    const totalHours = hours + minutes / 60;
    setTotalAmount(Math.round(totalHours * hourlyRate));
  }, [hours, minutes, hourlyRate]);

  useEffect(() => {
    // Load records from local storage on component mount
    const savedRecords = localStorage.getItem("tractorRecords");
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !address) return;

    const newRecord = {
      id: Date.now().toString(),
      name,
      address,
      amount: totalAmount,
      note,
      date: new Date().toLocaleDateString(),
    };

    const updatedRecords = [...records, newRecord];
    setRecords(updatedRecords);
    localStorage.setItem("tractorRecords", JSON.stringify(updatedRecords));
    alert("Record saved successfully...!");

    // Reset form
    setHours("");
    setMinutes("");
    setHourlyRate("");
    setName("");
    setAddress("");
    setNote("");
  };

  const deleteRecord = (id) => {
    const updatedRecords = records.filter((record) => record.id !== id);
    setRecords(updatedRecords);
    localStorage.setItem("tractorRecords", JSON.stringify(updatedRecords));
  };

  // Language Toggle
  const language = useSelector((state) => state.language.language);
  console.log(language);

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8">
        {language === "hi"
          ? "ट्रैक्टर किराया कैलकुलेटर"
          : "Tractor Rental Calculator"}
      </h1>

      {/* Custom Tabs */}
      <div className="w-full mb-6">
        <div className="flex w-full gap-2">
          <button
            className={`flex-1 py-3 border rounded-md font-medium text-center cursor-pointer ${
              activeTab === "calculator"
                ? "bg-blue-500 text-white"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("calculator")}
          >
            {language === "hi" ? "कैलकुलेटर" : "Calculator"}
          </button>
          <button
            className={`flex-1 py-3 border rounded-md font-medium text-center cursor-pointer ${
              activeTab === "records"
                ? "bg-blue-500 text-white"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("records")}
          >
            {language === "hi" ? "रेकार्ड" : "Records"}
          </button>
        </div>
      </div>

      {/* Calculator Tab */}
      {activeTab === "calculator" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-1">
              {language === "hi"
                ? "किराया शुल्क की गणना करें"
                : "Calculate Rental Fee"}
            </h2>
            <p className="text-gray-500 text-sm">
              {language === "hi"
                ? "कुल राशि की गणना करने के लिए समय और दर दर्ज करें"
                : "Enter time and rate to calculate the total amount"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="hours" className="block text-sm font-medium">
                  {language === "hi" ? "घंटे" : "Hours"}
                </label>
                <input
                  id="hours"
                  type="number"
                  min="0"
                  value={hours}
                  onChange={(e) =>
                    setHours(Number.parseInt(e.target.value) || 0)
                  }
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="minutes" className="block text-sm font-medium">
                  {language === "hi" ? "मिनट" : "Minutes"}
                </label>
                <input
                  id="minutes"
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) =>
                    setMinutes(Number.parseInt(e.target.value) || 0)
                  }
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="rate" className="block text-sm font-medium">
                {language === "hi" ? "प्रति घंटा दर (₹)" : "Hourly Rate (₹)"}
              </label>
              <input
                id="rate"
                type="number"
                min="0"
                value={hourlyRate}
                onChange={(e) =>
                  setHourlyRate(Number.parseInt(e.target.value) || 0)
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="p-4 bg-gray-100 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  {language === "hi" ? "कुल राशि" : "Total Amount"}
                </p>
                <p className="text-3xl font-bold">₹ {totalAmount}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">
                  {language === "hi" ? "ग्राहक का नाम" : "Customer Name"}
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="block text-sm font-medium">
                  {language === "hi" ? "पता" : "Address"}
                </label>
                <input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="note" className="block text-sm font-medium">
                  {language === "hi" ? "नोट (वैकल्पिक)" : "Note (Optional)"}
                </label>
                <textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {language === "hi" ? "सेव करें" : "Save Record"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Records Tab */}
      {activeTab === "records" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-1">
              {language === "hi" ? "सहेजे गए रिकॉर्ड" : "Saved Records"}
            </h2>
            <p className="text-gray-500 text-sm">
              {language === "hi"
                ? "अपने सहेजे गए किराये के रिकॉर्ड देखें और बदलाव करें"
                : "View and Edit your saved rental records"}
            </p>
          </div>

          <div className="border rounded-md h-[400px] overflow-y-auto p-4">
            {records.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                {" "}
                {language === "en"
                  ? "No records found"
                  : "कोई रिकॉर्ड नहीं मिला"}
              </p>
            ) : (
              <div className="space-y-4">
                {records.map((record) => (
                  <div key={record.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{record.name}</h3>
                        <p className="text-sm text-gray-500">
                          {record.address}
                        </p>
                      </div>
                      <button
                        className="p-1 text-gray-500 hover:text-red-500 focus:outline-none"
                        onClick={() => deleteRecord(record.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <p className="text-sm text-gray-500">{record.date}</p>
                      <p className="font-medium">₹ {record.amount}</p>
                    </div>
                    {record.note && (
                      <p className="mt-2 text-sm border-t pt-2">
                        {record.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default MainSection;
