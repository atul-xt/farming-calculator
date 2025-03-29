import React from "react";
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { APIURI } from "../../Config/config";
import { toast } from "react-toastify";
const MainSection = () => {
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("IsLoggedIn");
  if (!isLoggedIn) {
    window.location.href = "/login"; // Redirect to login page if not logged in
  }
  // Language Toggle
  const language = useSelector((state) => state.language.language);
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
      date: new Date(),
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

      const result = await response.json(); // Parse API response
      if (result.status) {
        const updatedRecords = [...records, result.data]; // Use API response data
        setRecords(updatedRecords);
        toast.success(
          language == "hi"
            ? "रिकॉर्ड सफलतापूर्वक सहेजा गया!"
            : "Record saved successfully!"
        );

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
        toast.error(
          language == "hi"
            ? `त्रुटि: ${result.message}`
            : `Error: ${result.message}`
        );
      }
    } catch (error) {
      console.error("Error saving record:", error);
      alert("Failed to save record. Please try again.");
    }
    setIsLoading(false);
  };

  // Fetch Records
  const fetchRecords = async () => {
    try {
      const response = await fetch(`${APIURI}records/getAllRecords`);
      const result = await response.json(); // Parse API response

      if (result.status) {
        setRecords(result.data);
      } else {
        setRecords([]);
      }
    } catch (error) {
      toast.error(
        language == "hi"
          ? "कुछ तकनीकी समस्या है, कुछ समय बाद प्रयास करें।"
          : "Failed to fetch records. Please try again."
      );
    }
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
        toast.success(
          language == "hi"
            ? "रिकॉर्ड सफलतापूर्वक हटा दिया गया!"
            : "Record deleted successfully!"
        );
      } else {
        toast.error(
          language == "hi"
            ? `त्रुटि: ${result.message}`
            : `Error: ${result.message}`
        );
      }
    } catch (error) {
      toast.error(
        language == "hi"
          ? "कुछ तकनीकी समस्या है, कुछ समय बाद प्रयास करें।"
          : "Failed to fetch records. Please try again."
      );
    }
    setIsLoading(false);
  };

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
        <div className="bg-white rounded-lg shadow-md p-2">
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
                    className={`p-4 border rounded-lg flex flex-col gap-1 ${
                      record.totalAmount - record.totalPaid > 0
                        ? "bg-red-100"
                        : "bg-green-200"
                    }`}
                  >
                    {/* First Row: Name */}
                    <h3 className="font-semibold text-lg flex justify-between">
                      {record.customerName}
                      {/* Delete Button */}
                      <button
                        className=" p-1 text-gray-500 hover:text-red-500 focus:outline-none"
                        onClick={() => deleteRecord(record._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </h3>

                    {/* Second Row: Address */}
                    <p className="text-sm text-gray-500">
                      {language === "en" ? "Address : " : "पता : "}{" "}
                      {record.customerAddress}
                    </p>

                    {/* Third Row: Mobile Number */}
                    <p className="text-sm text-gray-500">
                      {language === "hi" ? "मोबाइल नंबर " : "Mobile Number"}:{" "}
                      {record.customerPhone}
                    </p>

                    {/* Fourth Row: Date */}
                    <p className="text-sm text-gray-500">
                      {language === "hi" ? "दिनांक :" : "Date :"}{" "}
                      {record?.date.split("T")[0]}
                    </p>

                    {/* Fifth Row: Hours & Minutes */}
                    <p className="text-sm text-gray-500">
                      {language === "hi" ? "समय :" : "Time :"} {record.hours}{" "}
                      {language === "hi" ? "घंटे" : "Hours"} {record.minutes}{" "}
                      {language === "hi" ? "मिनट" : "Minutes"}
                    </p>

                    {/* Sixth Row: Labours */}
                    <p className="text-sm text-gray-500">
                      {language === "hi" ? "मज़दूर " : "Labours"}:{" "}
                      {record.labourCount}
                    </p>
                    {/* Seventh Row: PerHourrate */}
                    <p className="text-sm text-gray-500">
                      {language === "hi"
                        ? "प्रति घंटा दर (₹)"
                        : "Hourly Rate (₹)"}
                      : {record.perHourRate}
                    </p>

                    {/* Payment Details */}
                    <div className="mt-2 flex flex-col gap-1">
                      <p className="font-medium">
                        {language === "hi" ? "कुल राशि : " : "Total Amount : "}₹{" "}
                        {record.totalAmount}
                      </p>
                      <p className="font-medium">
                        {language === "hi" ? "कुल जमा : " : "Total Deposit : "}₹{" "}
                        {record?.totalPaid}
                      </p>
                      <p className="font-medium">
                        {language === "hi"
                          ? "बाकी राशि : "
                          : "Remaining Amount : "}
                        ₹ {record?.totalAmount - record?.totalPaid}
                      </p>
                    </div>
                    {/* Share button */}
                    {record.totalAmount - record.totalPaid > 0 && (
                      <div className="flex flex-wrap md:flex-nowrap gap-2 justify-center items-center">
                        <button
                          className="mt-2 w-full md:w-1/2 flex justify-center items-center gap-2 cursor-pointer py-1 px-3 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
                          onClick={() => {
                            const phoneNumber = record.customerPhone; // No need for country code in SMS
                            const message =
                              language === "hi"
                                ? `\nनमस्ते ${
                                    record.customerName
                                  },\n\n📍 *पता:* ${
                                    record.customerAddress
                                  }\n📞 *मोबाइल नंबर:* ${
                                    record.customerPhone
                                  }\n📅 *दिनांक:* ${
                                    record?.date.split("T")[0]
                                  }\n🕒 *समय:* ${record.hours} घंटे ${
                                    record.minutes
                                  } मिनट\n👷 *मज़दूर:* ${
                                    record.labourCount
                                  }\n💰 *प्रति घंटा दर:* ₹${
                                    record.perHourRate
                                  }\n💵 *कुल राशि:* ₹${
                                    record.totalAmount
                                  }\n💵 *कुल जमा:* ₹${
                                    record.totalPaid
                                  }\n💳 *बाकी राशि:* ₹${
                                    record.totalAmount - record.totalPaid
                                  }\n\n📞 *संपर्क करें:* 7024037367 या 7489469406\n\n📷 *स्कैनर फोटो:* ${scannerPhoto}`
                                : `Hello ${
                                    record.customerName
                                  },\n\n📍 *Address:* ${
                                    record.customerAddress
                                  }\n📞 *Mobile Number:* ${
                                    record.customerPhone
                                  }\n📅 *Date:* ${
                                    record?.date.split("T")[0]
                                  }\n🕒 *Time:* ${record.hours} Hours ${
                                    record.minutes
                                  } Minutes\n👷 *Labours:* ${
                                    record.labourCount
                                  }\n💰 *Hourly Rate:* ₹${
                                    record.perHourRate
                                  }\n💵 *Total Amount:* ₹${
                                    record.totalAmount
                                  }\n💵 *Total Deposit:* ₹${
                                    record.totalPaid
                                  }\n💳 *Remaining Amount:* ₹${
                                    record.totalAmount - record.totalPaid
                                  }\n\n📞 *Contact:* 7024037367 or 7489469406\n\n📷 *Scanner Photo:* ${scannerPhoto}`;

                            // Format SMS URL with phone number and message
                            const smsURL = `sms:${phoneNumber}?&body=${encodeURIComponent(
                              message
                            )}`;

                            // Open SMS app
                            window.location.href = smsURL;
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-message-circle-icon lucide-message-circle"
                          >
                            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                          </svg>
                          {language === "hi" ? "मैसेज" : "Message"}
                        </button>

                        <button
                          className="mt-2 w-full md:w-1/2 flex justify-center items-center gap-2 cursor-pointer py-1 px-3 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
                          onClick={() => {
                            const phoneNumber = "91" + record.customerPhone;
                            const scannerPhoto =
                              "https://drive.google.com/file/d/1vZ4IvPvfsgrSK5Q5fW4yVI1J5HgfQWMo/view?usp=drive_link";
                            const message =
                              language === "hi"
                                ? `\nनमस्ते ${
                                    record.customerName
                                  },\n\n📍 *पता:* ${
                                    record.customerAddress
                                  }\n📞 *मोबाइल नंबर:* ${
                                    record.customerPhone
                                  }\n📅 *दिनांक:* ${
                                    record?.date.split("T")[0]
                                  }\n🕒 *समय:* ${record.hours} घंटे ${
                                    record.minutes
                                  } मिनट\n👷 *मज़दूर:* ${
                                    record.labourCount
                                  }\n💰 *प्रति घंटा दर:* ₹${
                                    record.perHourRate
                                  }\n💵 *कुल राशि:* ₹${
                                    record.totalAmount
                                  }\n💵 *कुल जमा:* ₹${
                                    record.totalPaid
                                  }\n💳 *बाकी राशि:* ₹${
                                    record.totalAmount - record.totalPaid
                                  }\n\n📞 *संपर्क करें:* 7024037367 या 7489469406\n\n📷 *स्कैनर फोटो:* ${scannerPhoto}`
                                : `Hello ${
                                    record.customerName
                                  },\n\n📍 *Address:* ${
                                    record.customerAddress
                                  }\n📞 *Mobile Number:* ${
                                    record.customerPhone
                                  }\n📅 *Date:* ${
                                    record?.date.split("T")[0]
                                  }\n🕒 *Time:* ${record.hours} Hours ${
                                    record.minutes
                                  } Minutes\n👷 *Labours:* ${
                                    record.labourCount
                                  }\n💰 *Hourly Rate:* ₹${
                                    record.perHourRate
                                  }\n💵 *Total Amount:* ₹${
                                    record.totalAmount
                                  }\n💵 *Total Deposit:* ₹${
                                    record.totalPaid
                                  }\n💳 *Remaining Amount:* ₹${
                                    record.totalAmount - record.totalPaid
                                  }\n\n📞 *Contact:* 7024037367 or 7489469406\n\n📷 *Scanner Photo:* ${scannerPhoto}`;

                            const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
                              message
                            )}`;
                            window.open(whatsappURL, "_blank");
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-message-circle-icon lucide-message-circle"
                          >
                            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                          </svg>
                          {language === "hi" ? "व्हाट्सऐप" : "Whatsapp"}
                        </button>
                      </div>
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
