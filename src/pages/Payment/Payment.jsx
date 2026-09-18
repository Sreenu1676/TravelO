import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Payment.css";

import travelOLogo from "./travelO-logo.png";
import phonepeLogo from "./phonepe.png";
import googlepayLogo from "./googlepay.png";
import cardLogo from "./card.png";
import upiLogo from "./upi.png";
import netbankingLogo from "./netbanking.png";
import walletLogo from "./wallet.png";
import paylaterLogo from "./paylater.png";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    hotel,
    checkIn,
    checkOut,
    guests,
    nights,
    roomTotal,
    serviceFee,
    total,
  } = location.state || {};

  const [selectedMethod, setSelectedMethod] = useState("");

  const [upiId, setUpiId] = useState("@ybl");

  const [isProcessing, setIsProcessing] = useState(false);

  const [processingStep, setProcessingStep] = useState(1);

  const upiInputRef = useRef(null);

  /* =========================================
     UPI ID
  ========================================= */

  const handleUpiIdChange = (event) => {
    let value = event.target.value;

    value = value.replace(/@ybl/gi, "");
    value = value.replace(/@/g, "");
    value = value.replace(/\s/g, "");

    const newValue = `${value}@ybl`;

    setUpiId(newValue);

    requestAnimationFrame(() => {
      if (upiInputRef.current) {
        upiInputRef.current.setSelectionRange(
          value.length,
          value.length
        );
      }
    });
  };

  const isUpiIdEntered =
    upiId.replace("@ybl", "").trim().length > 0;

  /* =========================================
     BACK
  ========================================= */

  const handleBack = () => {
    if (isProcessing) {
      return;
    }

    if (selectedMethod === "phonepe") {
      setSelectedMethod("");
      return;
    }

    navigate("/order-summary", {
      state: {
        hotel,
        checkIn,
        checkOut,
        guests,
        nights,
        roomTotal,
        serviceFee,
        total,
      },
    });
  };

  /* =========================================
     PAYMENT METHOD
  ========================================= */

  const handlePaymentMethod = (method) => {
    if (isProcessing) {
      return;
    }

    setSelectedMethod(method);
  };

  /* =========================================
     PAY NOW
  ========================================= */

  const handlePayNow = () => {
    if (!selectedMethod) {
      return;
    }

    if (
      selectedMethod === "phonepe" &&
      !isUpiIdEntered
    ) {
      return;
    }

    /*
     * Start Razorpay-style processing.
     */
    setIsProcessing(true);
    setProcessingStep(1);

    /*
     * After 2 seconds show second message.
     */
    setTimeout(() => {
      setProcessingStep(2);
    }, 2000);

    /*
     * After another 3 seconds show success page.
     */
    setTimeout(() => {
      navigate("/booking-success", {
        state: {
          hotel,
          checkIn,
          checkOut,
          guests,
          nights,
          roomTotal,
          serviceFee,
          total,
        },
      });
    }, 5000);
  };

  /* =========================================
     CANCEL PAYMENT
  ========================================= */

  const handleCancelPayment = () => {
    setIsProcessing(false);
    setProcessingStep(1);
  };

  /* =========================================
     QR
  ========================================= */

  const qrPattern = [
    "111111100101101111111",
    "100000101110101000001",
    "101110101011101011101",
    "101110100110101011101",
    "101110101101101011101",
    "100000101010101000001",
    "111111101010101111111",
    "000000001101100000000",
    "110101111010111010101",
    "001101001101001110010",
    "111011110010111011101",
    "010010001111000101010",
    "101111101001101110111",
    "000000001110101001000",
    "111111101011111010101",
    "100000101100001110010",
    "101110101011101011101",
    "101110100110101110100",
    "101110101101101011011",
    "100000101010101000001",
    "111111101101101111111",
  ];

  const renderQr = () => {
    return (
      <div className="qr-code">
        {qrPattern.map((row, rowIndex) =>
          row.split("").map((cell, columnIndex) => (
            <span
              key={`${rowIndex}-${columnIndex}`}
              className={
                cell === "1"
                  ? "qr-dark"
                  : "qr-light"
              }
            />
          ))
        )}

        <div className="qr-show-button">
          Show QR
        </div>
      </div>
    );
  };

  /* =========================================
     PROCESSING OVERLAY
  ========================================= */

  const processingMessage =
    processingStep === 1
      ? "Your payment is being processed"
      : "Please accept the request from Razorpay's VPA on your UPI app";

  /* =========================================
     PHONEPE / UPI
  ========================================= */

  if (selectedMethod === "phonepe") {
    return (
      <main className="payment-page">

        <div className="payment-backdrop"></div>

        <section className="payment-modal">

          {/* HEADER */}

          <header className="payment-header">

            <div className="payment-brand">

              <img
                src={travelOLogo}
                alt="TravelO"
                className="travel-o-logo-image"
              />

              <span className="travel-o-text">
                TravelO
              </span>

            </div>

            <button
              type="button"
              className="payment-close"
              onClick={handleBack}
              disabled={isProcessing}
            >
              ×
            </button>

          </header>


          {/* LANGUAGE */}

          <div className="payment-language-bar">

            <button
              type="button"
              className="payment-back-button"
              onClick={handleBack}
              disabled={isProcessing}
            >
              ←
            </button>

            <button
              type="button"
              className="language-button"
            >
              English
              <span className="language-arrow">
                ⌄
              </span>
            </button>

          </div>


          {/* UPI CONTENT */}

          <div className="upi-payment-content">

            <section className="upi-section">

              <h2>
                Pay With UPI QR
              </h2>

              <div className="qr-payment-box">

                <div className="qr-wrapper">
                  {renderQr()}
                </div>

                <div className="qr-information">

                  <p>
                    Scan the QR using any UPI
                    <br />
                    app on your phone.
                  </p>

                  <div className="upi-app-icons">

                    <img
                      src={googlepayLogo}
                      alt="Google Pay"
                    />

                    <img
                      src={phonepeLogo}
                      alt="PhonePe"
                    />

                    <span className="paytm-text">
                      paytm
                    </span>

                    <img
                      src={upiLogo}
                      alt="UPI"
                    />

                  </div>

                </div>

              </div>

            </section>


            <section className="upi-section upi-id-section">

              <h2>
                Pay Using UPI ID
              </h2>

              <div className="upi-id-box">

                <div className="upi-id-heading">

                  <span className="upi-id-logo">
                    <span className="upi-id-arrow"></span>
                  </span>

                  <div className="upi-id-text">

                    <span className="upi-main-title">
                      UPI ID
                    </span>

                    <span className="upi-subtitle">
                      Google Pay, BHIM, PhonePe & more
                    </span>

                  </div>

                  <span className="upi-check">
                    ✓
                  </span>

                </div>


                <div className="upi-input-wrapper">

                  <label>
                    Enter your UPI ID
                  </label>

                  <input
                    ref={upiInputRef}
                    type="text"
                    value={upiId}
                    onChange={handleUpiIdChange}
                    disabled={isProcessing}
                    onFocus={() => {
                      const prefixLength =
                        upiId.replace("@ybl", "").length;

                      requestAnimationFrame(() => {
                        if (upiInputRef.current) {
                          upiInputRef.current.setSelectionRange(
                            prefixLength,
                            prefixLength
                          );
                        }
                      });
                    }}
                  />

                </div>

              </div>

            </section>

          </div>


          {/* FOOTER */}

          <footer className="payment-footer">

            <div className="payment-amount">

              <strong>
                ₹{" "}
                {Number(total || 0).toLocaleString(
                  "en-IN"
                )}
              </strong>

              <button
                type="button"
                className="view-details-button"
              >
                View Details
              </button>

            </div>

            <button
              type="button"
              className={`pay-now-button upi-pay-button ${
                isUpiIdEntered
                  ? "upi-pay-enabled"
                  : ""
              }`}
              disabled={
                !isUpiIdEntered ||
                isProcessing
              }
              onClick={handlePayNow}
            >
              Pay Now
            </button>

          </footer>


          {/* PROCESSING */}

          {isProcessing && (
            <div className="processing-layer">

              <div className="processing-panel">

                <p className="processing-message">
                  {processingMessage}
                </p>

                <div className="processing-spinner">
                  <div className="spinner-inner"></div>
                </div>

                <button
                  type="button"
                  className="cancel-payment-button"
                  onClick={handleCancelPayment}
                >
                  Cancel Payment
                </button>

              </div>

            </div>
          )}

        </section>

      </main>
    );
  }


  /* =========================================
     PAYMENT METHODS
  ========================================= */

  return (
    <main className="payment-page">

      <div className="payment-backdrop"></div>

      <section className="payment-modal">

        <header className="payment-header">

          <div className="payment-brand">

            <img
              src={travelOLogo}
              alt="TravelO"
              className="travel-o-logo-image"
            />

            <span className="travel-o-text">
              TravelO
            </span>

          </div>

          <button
            type="button"
            className="payment-close"
            onClick={handleBack}
          >
            ×
          </button>

        </header>


        <div className="payment-language-bar">

          <button
            type="button"
            className="payment-back-button"
            onClick={handleBack}
          >
            ←
          </button>

          <button
            type="button"
            className="language-button"
          >
            English
            <span className="language-arrow">
              ⌄
            </span>
          </button>

        </div>


        <div className="payment-content">

          <section className="payment-section">

            <h2>
              Preferred Payment Methods
            </h2>

            <div className="payment-method-box">

              <button
                type="button"
                className="payment-row"
                onClick={() =>
                  handlePaymentMethod("phonepe")
                }
              >

                <img
                  src={phonepeLogo}
                  alt="PhonePe"
                  className="payment-icon-image"
                />

                <span className="payment-row-title">
                  UPI - PhonePe
                </span>

                <span className="payment-chevron">
                  ›
                </span>

              </button>


              <button
                type="button"
                className="payment-row"
                onClick={() =>
                  handlePaymentMethod("googlepay")
                }
              >

                <img
                  src={googlepayLogo}
                  alt="Google Pay"
                  className="payment-icon-image"
                />

                <span className="payment-row-title">
                  UPI - Google Pay
                </span>

                <span className="payment-chevron">
                  ›
                </span>

              </button>

            </div>

          </section>


          <section className="payment-section other-payment-section">

            <h2>
              Cards, UPI & More
            </h2>

            <div className="payment-method-box">

              <button
                type="button"
                className="payment-row payment-row-large"
                onClick={() =>
                  handlePaymentMethod("card")
                }
              >

                <img
                  src={cardLogo}
                  alt="Card"
                  className="payment-icon-image"
                />

                <span className="payment-row-content">

                  <span className="payment-row-title">
                    Card
                  </span>

                  <span className="payment-row-subtitle">
                    Visa, MasterCard, RuPay, and Maestro
                  </span>

                </span>

                <span className="payment-chevron">
                  ›
                </span>

              </button>


              <button
                type="button"
                className="payment-row payment-row-large"
                onClick={() =>
                  handlePaymentMethod("upi")
                }
              >

                <img
                  src={upiLogo}
                  alt="UPI"
                  className="payment-icon-image"
                />

                <span className="payment-row-content">

                  <span className="payment-row-title">
                    UPI / QR
                  </span>

                  <span className="payment-row-subtitle">
                    Google Pay, PhonePe & more
                  </span>

                </span>

                <span className="payment-chevron">
                  ›
                </span>

              </button>


              <button
                type="button"
                className="payment-row payment-row-large"
                onClick={() =>
                  handlePaymentMethod("netbanking")
                }
              >

                <img
                  src={netbankingLogo}
                  alt="Netbanking"
                  className="payment-icon-image"
                />

                <span className="payment-row-content">

                  <span className="payment-row-title">
                    Netbanking
                  </span>

                  <span className="payment-row-subtitle">
                    All Indian banks
                  </span>

                </span>

                <span className="payment-chevron">
                  ›
                </span>

              </button>


              <button
                type="button"
                className="payment-row payment-row-large"
                onClick={() =>
                  handlePaymentMethod("wallet")
                }
              >

                <img
                  src={walletLogo}
                  alt="Wallet"
                  className="payment-icon-image"
                />

                <span className="payment-row-content">

                  <span className="payment-row-title">
                    Wallet
                  </span>

                  <span className="payment-row-subtitle">
                    MobiKwik & more
                  </span>

                </span>

                <span className="payment-chevron">
                  ›
                </span>

              </button>


              <button
                type="button"
                className="payment-row payment-row-large"
                onClick={() =>
                  handlePaymentMethod("paylater")
                }
              >

                <img
                  src={paylaterLogo}
                  alt="Pay Later"
                  className="payment-icon-image"
                />

                <span className="payment-row-content">

                  <span className="payment-row-title">
                    Pay Later
                  </span>

                </span>

                <span className="payment-chevron">
                  ›
                </span>

              </button>

            </div>

          </section>

        </div>


        <footer className="payment-footer">

          <div className="payment-amount">

            <strong>
              ₹{" "}
              {Number(total || 0).toLocaleString(
                "en-IN"
              )}
            </strong>

            <button
              type="button"
              className="view-details-button"
            >
              View Details
            </button>

          </div>

          <button
            type="button"
            className="pay-now-button"
            disabled={!selectedMethod}
            onClick={handlePayNow}
          >
            Pay Now
          </button>

        </footer>

      </section>

    </main>
  );
};

export default Payment;