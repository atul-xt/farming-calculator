import React from "react";
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { APIURI } from "../../Config/config";
import { toast } from "react-toastify";
const MainSection = () => {
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [records, setRecords] = useState([]);
  const [labourCount, setLabourCount] = useState("");
  const [totalPaid, setTotalPaid] = useState("");
  const [activeTab, setActiveTab] = useState("calculator");
  const [isloading, setIsLoading] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [customerMobileNumber, setCustomerMobileNumber] = useState("");
  useEffect(() => {
    // Calculate total amount whenever hours, minutes, or hourlyRate changes
    const totalHours = hours + minutes / 60;
    setTotalAmount(Math.round(totalHours * hourlyRate));
  }, [hours, minutes, hourlyRate]);

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !address) {
      alert("Please enter required fields!");
      return;
    }
    setIsLoading(true);
    const newRecord = {
      customerName: name,
      customerPhone: customerMobileNumber,
      customerAddress: address,
      totalAmount: totalAmount,
      note: note,
      date: new Date().toLocaleDateString(),
      hours: hours,
      minutes: minutes,
      perHourRate: hourlyRate,
      labourCount: labourCount || 0, // Ensure labourCount is always a number
      totalPaid: totalPaid || 0, // Ensure totalPaid is always a number
    };

    try {
      const response = await fetch(`${APIURI}records/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRecord),
      });

      if (!response.ok) {
        throw new Error(`Failed to save record: ${response.statusText}`);
      }

      const result = await response.json(); // Parse API response
      if (result.status) {
        const updatedRecords = [...records, result.data]; // Use API response data
        setRecords(updatedRecords);
        toast.success("Record saved successfully!");

        // Reset form fields
        setHours("");
        setMinutes("");
        setHourlyRate("");
        setName("");
        setAddress("");
        setNote("");
        setTotalAmount("");
        setCustomerMobileNumber("");
        setLabourCount("");
        setTotalPaid("");
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error saving record:", error);
      alert("Failed to save record. Please try again.");
    }
    setIsLoading(false);
  };

  // Fetch Records
  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APIURI}records/getAllRecords`);
      const result = await response.json(); // Parse API response
      console.log(result);

      if (result.status) {
        setRecords(result.data);
      } else {
        setRecords([]);
      }
    } catch (error) {
      console.error("Error fetching records:", error);
      toast.error("Failed to fetch records. Please try again.");
    }
    setIsLoading(false);
  };
  // Delete Records
  const deleteRecord = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${APIURI}records/deleteRecord/${id}`, {
        method: "DELETE",
      });
      const result = await response.json(); // Parse API response

      if (result.status) {
        const updatedRecords = records.filter((record) => record._id !== id);
        setRecords(updatedRecords);
        toast.success("Record deleted successfully!");
      } else {
        toast.error(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      toast.error("Failed to delete record. Please try again.");
    }
    setIsLoading(false);
  };

  // Language Toggle
  const language = useSelector((state) => state.language.language);
  return isloading ? (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white mt-4 text-lg">Loading...</p>
      </div>
    </div>
  ) : (
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
            {language === "hi" ? "रिकॉर्ड" : "Records"}
          </button>
        </div>
      </div>

      {/* Calculator Tab */}
      {activeTab === "calculator" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-1">
              {language === "hi" ? "किराया जोड़े" : "Calculate Rental Fee"}
            </h2>
            <p className="text-gray-500 text-sm">
              {language === "hi"
                ? "कुल राशि की गणना करने के लिए समय और दर दर्ज करें"
                : "Enter time and rate to calculate the total amount"}
            </p>
          </div>

          <div className="space-y-6">
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
                <label htmlFor="name" className="block text-sm font-medium">
                  {language === "hi"
                    ? "ग्राहक का मोबाइल नंबर "
                    : "Customer Mobile Number"}
                </label>
                <input
                  id="name"
                  value={customerMobileNumber}
                  onChange={(e) => setCustomerMobileNumber(e.target.value)}
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

              {/* <div className="space-y-2">
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
              </div> */}
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
                  <label
                    htmlFor="minutes"
                    className="block text-sm font-medium"
                  >
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
                <label
                  htmlFor="labourCount"
                  className="block text-sm font-medium"
                >
                  {language === "hi" ? "मज़दूरों की संख्या" : "Labours Count"}
                </label>
                <input
                  id="rate"
                  type="number"
                  min={0}
                  value={labourCount}
                  onChange={(e) =>
                    setLabourCount(Number.parseInt(e.target.value) || 0)
                  }
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
              <div className="space-y-2">
                <label
                  htmlFor="labourCount"
                  className="block text-sm font-medium"
                >
                  {language === "hi" ? "जमा" : "Paid"}
                </label>
                <input
                  id="rate"
                  type="number"
                  min={0}
                  value={totalPaid}
                  onChange={(e) =>
                    setTotalPaid(Number.parseInt(e.target.value) || 0)
                  }
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="labourCount"
                  className="block text-sm font-medium"
                >
                  {language === "hi" ? "बाकी" : "Remaining Amount"}
                </label>
                <input
                  id="rate"
                  type="number"
                  min={0}
                  value={totalAmount - totalPaid}
                  // onChange={(e) =>
                  //   setTotalPaid(Number.parseInt(e.target.value) || 0)
                  // }
                  disabled
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

          <div className="border rounded-md h-[400px] overflow-y-auto p-4 w-full  mx-auto">
            {records.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                {language === "en"
                  ? "No records found"
                  : "कोई रिकॉर्ड नहीं मिला"}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                {records.map((record) => (
                  <div
                    key={record._id}
                    className={`p-4  border rounded-lg ${
                      record.totalAmount - record.totalPaid >= 0
                        ? "bg-red-100"
                        : "bg-green-200"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-full">
                        <h3 className="font-semibold flex flex-wrap justify-between w-full pr-5">
                          <span className="truncate">
                            {record.customerName}
                          </span>
                          <span>
                            {record.hours}{" "}
                            {language === "hi" ? "घंटे" : "Hours"}{" "}
                            {record.minutes}{" "}
                            {language === "hi" ? "मिनट" : "Minutes"}
                          </span>
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {record.customerAddress}
                        </p>
                      </div>
                      <button
                        className="p-1 text-gray-500 hover:text-red-500 focus:outline-none"
                        onClick={() => deleteRecord(record._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2 w-full grid grid-cols-1 md:grid-cols-2   gap-2">
                      <div className="flex flex-col gap-2 ">
                        <p className="text-sm text-gray-500">
                          {language === "hi" ? "मोबाइल नंबर " : "Mobile Number"}{" "}
                          : {record.customerPhone}
                        </p>
                        <p className="text-sm text-gray-500">
                          {record?.date.split("T")[0]}
                        </p>
                        <p className="text-sm text-gray-500">
                          {language === "hi" ? "मज़दूर " : "Labours "} :{" "}
                          {record.labourCount}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 md:items-end">
                        <p className="font-medium">
                          {language === "hi"
                            ? "कुल राशि : "
                            : "Total Amount : "}
                          ₹ {record.totalAmount}
                        </p>
                        <p className="font-medium">
                          {language === "hi"
                            ? "कुल जमा : "
                            : "Total Deposit : "}
                          ₹ {record?.totalPaid}
                        </p>
                        <p className="font-medium">
                          {language === "hi"
                            ? "बाकी राशि : "
                            : "Remaining Amount : "}
                          ₹ {record?.totalAmount - record?.totalPaid}
                        </p>
                      </div>
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
