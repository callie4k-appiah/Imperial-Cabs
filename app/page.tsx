{/* VEHICLE CAROUSEL */}
<div className="fleet-carousel-wrapper">
  <div
    ref={carouselRef}
    className="fleet-carousel"
    onScroll={handleScroll}
  >
    {vehicles.map((vehicle) => (
      <article
        className="vehicle-card"
        key={vehicle.name}
      >
        <div className="vehicle-image">
          <img
            src={vehicle.image}
            alt={`${vehicle.name} - Imperial Cabs`}
          />
        </div>

        <div className="vehicle-info">
          <div>
            <span className="vehicle-label">
              IMPERIAL CABS
            </span>

            <h3>{vehicle.name}</h3>
          </div>

          <span className="vehicle-electric">
            VOLLEDIG ELEKTRISCH
          </span>
        </div>
      </article>
    ))}
  </div>

  <div className="carousel-controls">
    <button
      type="button"
      className="carousel-button"
      onClick={previousVehicle}
      aria-label="Vorige auto"
    >
      ←
    </button>

    <div className="carousel-dots">
      {vehicles.map((vehicle, index) => (
        <button
          key={vehicle.name}
          type="button"
          className={`carousel-dot ${
            activeVehicle === index ? "active" : ""
          }`}
          onClick={() => scrollToVehicle(index)}
          aria-label={`Bekijk ${vehicle.name}`}
        />
      ))}
    </div>

    <button
      type="button"
      className="carousel-button"
      onClick={nextVehicle}
      aria-label="Volgende auto"
    >
      →
    </button>
  </div>

  <div className="carousel-caption">
    <span>←</span>
    Swipe om meer auto&apos;s te bekijken
    <span>→</span>
  </div>
</div>
