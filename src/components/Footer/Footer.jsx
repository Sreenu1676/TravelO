import { useState } from "react";
import "./Footer.css";

const footerData = {
  Popular: [
    ["Visakhapatnam", "Beach stays"],
    ["Bangalore", "Monthly rentals"],
    ["Mumbai", "Apartment rentals"],
    ["Manali", "Mountain stays"],
    ["Udaipur", "Heritage stays"],
    ["Kolkata", "City stays"],

    ["Goa", "Holiday rentals"],
    ["Chennai", "Beach rentals"],
    ["Jaipur", "Villa rentals"],
    ["Ooty", "Holiday rentals"],
    ["Pondicherry", "Beach stays"],
    ["Agra", "Holiday rentals"],

    ["Hyderabad", "City stays"],
    ["Delhi", "Holiday stays"],
    ["Kerala", "Resort stays"],
    ["Coorg", "Villa rentals"],
    ["Rishikesh", "Adventure stays"],
  ],

  "Arts & culture": [
    ["Jaipur", "Heritage stays"],
    ["Udaipur", "Palace stays"],
    ["Agra", "Heritage stays"],
    ["Varanasi", "Cultural stays"],
    ["Delhi", "Historical stays"],
    ["Hyderabad", "Cultural stays"],

    ["Mysore", "Heritage stays"],
    ["Kolkata", "Cultural stays"],
    ["Amritsar", "Cultural stays"],
    ["Lucknow", "Heritage stays"],
    ["Jodhpur", "Heritage stays"],
    ["Hampi", "Historical stays"],

    ["Madurai", "Cultural stays"],
    ["Pune", "Arts & culture stays"],
    ["Bhopal", "Heritage stays"],
    ["Chandigarh", "Cultural stays"],
    ["Mandu", "Historical stays"],
  ],

  Beach: [
    ["Goa", "Beach stays"],
    ["Visakhapatnam", "Beach stays"],
    ["Pondicherry", "Beach stays"],
    ["Kovalam", "Beach resorts"],
    ["Gokarna", "Beach stays"],
    ["Varkala", "Cliffside stays"],

    ["Andaman", "Island stays"],
    ["Alleppey", "Backwater stays"],
    ["Chennai", "Beach stays"],
    ["Mangalore", "Coastal stays"],
    ["Digha", "Beach rentals"],
    ["Puri", "Beach stays"],

    ["Kanyakumari", "Coastal stays"],
    ["Lakshadweep", "Island stays"],
    ["Daman", "Beach stays"],
    ["Alibaug", "Beach rentals"],
    ["Kashid", "Beach stays"],
  ],

  Mountains: [
    ["Manali", "Mountain stays"],
    ["Shimla", "Hill stays"],
    ["Darjeeling", "Mountain stays"],
    ["Mussoorie", "Hill stays"],
    ["Ooty", "Mountain stays"],
    ["Munnar", "Mountain retreats"],

    ["Coorg", "Hill stays"],
    ["Nainital", "Lakeside stays"],
    ["Kodaikanal", "Mountain stays"],
    ["Rishikesh", "Mountain stays"],
    ["Srinagar", "Mountain stays"],
    ["Gangtok", "Mountain stays"],

    ["Leh", "Mountain stays"],
    ["Ladakh", "Adventure stays"],
    ["Meghalaya", "Hill stays"],
    ["Wayanad", "Nature stays"],
    ["Tawang", "Mountain stays"],
  ],

  Outdoors: [
    ["Rishikesh", "Adventure stays"],
    ["Manali", "Outdoor stays"],
    ["Coorg", "Nature stays"],
    ["Munnar", "Nature retreats"],
    ["Wayanad", "Forest stays"],
    ["Jim Corbett", "Wildlife stays"],

    ["Leh", "Adventure stays"],
    ["Ladakh", "Mountain stays"],
    ["Andaman", "Outdoor stays"],
    ["Kashmir", "Nature stays"],
    ["Sikkim", "Adventure stays"],
    ["Meghalaya", "Nature stays"],

    ["Himachal Pradesh", "Outdoor stays"],
    ["Uttarakhand", "Nature stays"],
    ["Arunachal Pradesh", "Adventure stays"],
    ["Goa", "Outdoor experiences"],
    ["Kerala", "Nature stays"],
  ],

  "Things to do": [
    ["Goa", "Beach experiences"],
    ["Jaipur", "Cultural experiences"],
    ["Manali", "Adventure activities"],
    ["Rishikesh", "Outdoor activities"],
    ["Kerala", "Backwater experiences"],
    ["Mumbai", "City experiences"],

    ["Delhi", "Sightseeing"],
    ["Agra", "Historical experiences"],
    ["Udaipur", "Heritage experiences"],
    ["Munnar", "Nature experiences"],
    ["Andaman", "Island experiences"],
    ["Varanasi", "Cultural experiences"],

    ["Hyderabad", "City experiences"],
    ["Bangalore", "Local experiences"],
    ["Chennai", "Coastal experiences"],
    ["Kolkata", "Cultural experiences"],
    ["Ooty", "Nature experiences"],
  ],
};

const categories = Object.keys(footerData);

const Footer = () => {
  const [activeCategory, setActiveCategory] = useState("Popular");

  const destinations = footerData[activeCategory];

  return (
    <footer className="travel-footer">

      {/* =========================================
          INSPIRATION
      ========================================== */}

      <section className="footer-inspiration">

        <h2>Inspiration for future getaways</h2>

        <div className="footer-tabs">

          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={
                activeCategory === category
                  ? "active"
                  : ""
              }
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}

        </div>


        {/* =========================================
            DESTINATIONS
        ========================================== */}

        <div className="destination-grid">

          {destinations.slice(0, 17).map(
            ([destination, description], index) => (
              <div
                className="destination-item"
                key={`${destination}-${index}`}
              >
                <h4>{destination}</h4>

                <p>{description}</p>
              </div>
            )
          )}

          {/* Show More */}

          <div className="destination-item show-more">
            <h4>
              Show more
              <span className="show-more-arrow">⌄</span>
            </h4>
          </div>

        </div>

      </section>


      {/* =========================================
          MAIN FOOTER
      ========================================== */}

      <section className="footer-main">

        <div className="footer-column">

          <h3>Support</h3>

          <a href="#">Help Centre</a>
          <a href="#">Safety information</a>
          <a href="#">Cancellation options</a>
          <a href="#">Contact us</a>
          <a href="#">Accessibility</a>
          <a href="#">Report an issue</a>

        </div>


        <div className="footer-column">

          <h3>Explore TravelO</h3>

          <a href="#">Destinations</a>
          <a href="#">Hotels</a>
          <a href="#">Travel guides</a>
          <a href="#">Experiences</a>
          <a href="#">Popular places</a>
          <a href="#">Special offers</a>

        </div>


        <div className="footer-column">

          <h3>TravelO</h3>

          <a href="#">About us</a>
          <a href="#">Our services</a>
          <a href="#">Careers</a>
          <a href="#">Blog</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>

        </div>

      </section>


      {/* =========================================
          BOTTOM FOOTER
      ========================================== */}

      <section className="footer-bottom">

        <div className="footer-legal">

          <span>© 2026 TravelO, Inc.</span>

          <span>·</span>

          <a href="#">Privacy</a>

          <span>·</span>

          <a href="#">Terms</a>

          <span>·</span>

          <a href="#">Company details</a>

        </div>


        <div className="footer-options">

          <span className="footer-language">

            <span className="material-icons-outlined">
              language
            </span>

            English (IN)

          </span>

          <span>₹ INR</span>

          <a href="#" aria-label="Facebook">
            <span className="material-icons-outlined">
              public
            </span>
          </a>

          <a href="#" aria-label="Instagram">
            <span className="material-icons-outlined">
              photo_camera
            </span>
          </a>

        </div>

      </section>

    </footer>
  );
};

export default Footer;