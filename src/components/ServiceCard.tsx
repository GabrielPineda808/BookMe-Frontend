import React from "react";
import { Link } from "react-router-dom";

export default function ServiceCard({ service }: any) {
  return (
    <Link
      to={`/my-services/${service.handle}`}
      className="text-decoration-none"
    >
      <article className="card p-3 mb-3">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h5 className="mb-1" style={{ color: "inherit" }}>
              {service.name}
            </h5>
            <div className="small text-muted">
              <span>{service.handle}</span>
              {" • "}
              <span>{service.location?.city}</span>
              {" • "}
              <span>
                {service.open} — {service.close}
              </span>
            </div>
          </div>

          <div>
            <button
              type="button"
              className="btn btn-outline-secondary"
              aria-label={`View ${service.service_name}`}
            >
              View service
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}
