// CreateService.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import api from "../api/Api";
import type { LocationDto } from "../types/LocationDto";
import ServiceCard from "../components/ServiceCard";

type ServicePayload = {
  handle: string;
  service_name: string;
  location: LocationDto;
  desc?: string | null;
  open: string; // backend: "HH:mm:ss"
  close: string; // backend: "HH:mm:ss"
  interval: number;
};

// ---------------------- helpers ----------------------
const HANDLE_RE = /^[a-zA-Z0-9_-]+$/;
const CITY_STATE_COUNTRY_RE = /^[a-zA-Z\s'-]+$/;
const ZIP_RE = /^\d{5}(-\d{4})?$/;

// count characters excluding whitespace
function nonWhitespaceLength(s: string | undefined | null) {
  if (!s) return 0;
  return s.replace(/\s+/g, "").length;
}

// generate time options in "HH:mm" format with given step (minutes)
function generateTimeOptions(stepMinutes = 5) {
  const opts: string[] = [];
  for (let m = 0; m < 24 * 60; m += stepMinutes) {
    const hh = Math.floor(m / 60)
      .toString()
      .padStart(2, "0");
    const mm = (m % 60).toString().padStart(2, "0");
    opts.push(`${hh}:${mm}`);
  }
  return opts;
}

function toBackendTime(hhmm: string) {
  // convert "HH:mm" to "HH:mm:ss"
  if (!hhmm) return hhmm;
  return hhmm.length === 5 ? `${hhmm}:00` : hhmm;
}

// interval options (5 to 240 step 5)
function generateIntervalOptions() {
  const arr: number[] = [];
  for (let i = 5; i <= 240; i += 5) arr.push(i);
  return arr;
}

// validate location fields according to your backend restrictions
function validateLocation(loc?: LocationDto) {
  const errors: Record<string, string> = {};
  if (!loc) {
    errors.location = "Location is required";
    return errors;
  }
  if (!loc.address || loc.address.trim().length === 0) {
    errors.address = "Address is required";
  } else if (loc.address.length > 255) {
    errors.address = "Address cannot exceed 255 characters";
  }

  if (!loc.city || loc.city.trim().length === 0) {
    errors.city = "City is required";
  } else if (!(loc.city.length >= 2 && loc.city.length <= 100)) {
    errors.city = "City must be between 2 and 100 characters";
  } else if (!CITY_STATE_COUNTRY_RE.test(loc.city)) {
    errors.city =
      "City can only contain letters, spaces, hyphens, and apostrophes";
  }

  if (!loc.state || loc.state.trim().length === 0) {
    errors.state = "State is required";
  } else if (!(loc.state.length >= 2 && loc.state.length <= 50)) {
    errors.state = "State must be between 2 and 50 characters";
  } else if (!CITY_STATE_COUNTRY_RE.test(loc.state)) {
    errors.state =
      "State can only contain letters, spaces, hyphens, and apostrophes";
  }

  if (!loc.area_code || loc.area_code.trim().length === 0) {
    errors.area_code = "Area code is required";
  } else if (!ZIP_RE.test(loc.area_code)) {
    errors.area_code =
      "Area code must be a valid US ZIP code (12345 or 12345-6789)";
  }

  if (!loc.country || loc.country.trim().length === 0) {
    errors.country = "Country is required";
  } else if (!(loc.country.length >= 2 && loc.country.length <= 50)) {
    errors.country = "Country must be between 2 and 50 characters";
  } else if (!CITY_STATE_COUNTRY_RE.test(loc.country)) {
    errors.country =
      "Country can only contain letters, spaces, hyphens, and apostrophes";
  }

  return errors;
}

// ---------------------- component ----------------------
export default function CreateService() {
  const { user } = useAuth();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // form fields
  const [serviceHandle, setServiceHandle] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [desc, setDesc] = useState("");
  const [open, setOpen] = useState("09:00");
  const [close, setClose] = useState("17:00");
  const [interval, setInterval] = useState<number>(30);

  // location state
  const [location, setLocation] = useState<LocationDto>({
    address: "",
    city: "",
    state: "",
    area_code: "",
    country: "",
  } as LocationDto);

  // helpers
  const timeOptions = useMemo(() => generateTimeOptions(5), []);
  const intervalOptions = useMemo(() => generateIntervalOptions(), []);

  // fetch current user's services
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/service/my-services");
        if (!cancelled) setServices(res.data ?? []);
      } catch (err: any) {
        if (err.name === "CanceledError" || err.name === "AbortError") {
          // ignore
        } else {
          console.error(err);
          setError(
            err?.response?.data?.message ??
              err.message ??
              "Failed to load services"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [user]);

  // validation state
  const handleValid =
    serviceHandle.length >= 3 &&
    serviceHandle.length <= 50 && // backend says 3..50, earlier you used 3..10 in UI — choose whichever you want
    HANDLE_RE.test(serviceHandle) &&
    serviceName.length >= 2 &&
    serviceName.length <= 100 &&
    nonWhitespaceLength(desc) <= 500 &&
    open.length === 5 &&
    close.length === 5 &&
    interval >= 5 &&
    interval <= 240 &&
    interval % 5 === 0;

  const locationErrors = validateLocation(location);

  const isFormValid = handleValid && Object.keys(locationErrors).length === 0;

  // display friendly error strings
  function renderLocationErrors() {
    return Object.values(locationErrors).map((e, i) => (
      <div key={i} className="text-danger small">
        {e}
      </div>
    ));
  }

  // submit handler
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // final guard
    if (!isFormValid) {
      setError("Please fix validation errors before submitting.");
      return;
    }

    const payload: ServicePayload = {
      handle: serviceHandle,
      service_name: serviceName,
      location,
      desc: desc.trim().length ? desc : null,
      open: toBackendTime(open),
      close: toBackendTime(close),
      interval,
    };

    setLoading(true);
    try {
      const res = await api.post("/service/create-service", payload);
      // success handling — maybe push to services list or navigate
      setServices((s) => [res.data, ...s]);
      // reset form or navigate
      setServiceHandle("");
      setServiceName("");
      setDesc("");
      setOpen("09:00");
      setClose("17:00");
      setInterval(30);
      setLocation({
        address: "",
        city: "",
        state: "",
        area_code: "",
        country: "",
      } as LocationDto);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ??
          err.message ??
          "Failed to create service"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dark container py-4">
      <div className="card p-3">
        <h4>Create a service</h4>

        <form onSubmit={handleSubmit} noValidate>
          {error && (
            <div
              className="alert alert-danger py-2 px-3"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}

          <div className="row g-2 mb-3">
            <div className="col-12 col-md-6">
              <label
                htmlFor="serviceName"
                className="form-label small text-muted"
              >
                Service Name
              </label>
              <input
                id="serviceName"
                type="text"
                className="form-control"
                placeholder="Service Name"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                required
              />
              <div className="dark small text-muted">
                {serviceName.length} / 100
              </div>
            </div>

            <div className="col-12 col-md-6">
              <label
                htmlFor="serviceHandle"
                className="dark form-label small text-muted"
              >
                Service Handle
              </label>
              <input
                id="serviceHandle"
                type="text"
                className="dark form-control"
                placeholder="Service Handle (letters, numbers, - or _)"
                value={serviceHandle}
                onChange={(e) => setServiceHandle(e.target.value)}
                required
              />
              <div className="dark small">
                <span
                  className={
                    serviceHandle.length >= 3 && serviceHandle.length <= 50
                      ? "text-success"
                      : "text-danger"
                  }
                >
                  {serviceHandle.length >= 3 && serviceHandle.length <= 50
                    ? "Handle length OK"
                    : "Handle 3-50 chars"}
                </span>
                {" • "}
                <span
                  className={
                    HANDLE_RE.test(serviceHandle || " ")
                      ? "text-success"
                      : "text-danger"
                  }
                >
                  {HANDLE_RE.test(serviceHandle || " ")
                    ? "Pattern OK"
                    : "Only letters, numbers, hyphen, underscore"}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label
              htmlFor="description"
              className="dark form-label small text-muted"
            >
              Service Description
            </label>
            <textarea
              id="description"
              className="dark form-control"
              placeholder="Describe your service..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
            />
            <div className="dark small text-muted">
              {nonWhitespaceLength(desc)} non-whitespace chars (max 500)
            </div>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6 col-md-3">
              <label
                htmlFor="open"
                className="dark form-label small text-muted"
              >
                Open (24h)
              </label>
              <select
                id="open"
                className="dark form-select"
                value={open}
                onChange={(e) => setOpen(e.target.value)}
              >
                {timeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-6 col-md-3">
              <label
                htmlFor="close"
                className="dark form-label small text-muted"
              >
                Close (24h)
              </label>
              <select
                id="close"
                className="form-select"
                value={close}
                onChange={(e) => setClose(e.target.value)}
              >
                {timeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-6 col-md-3">
              <label
                htmlFor="interval"
                className="dark form-label small text-muted"
              >
                Interval (minutes)
              </label>
              <select
                id="interval"
                className="dark form-select"
                value={interval}
                onChange={(e) => setInterval(Number(e.target.value))}
              >
                {intervalOptions.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <fieldset className="dark mb-3 border p-3">
            <legend className="small">Location</legend>

            <div className="dark mb-2">
              <label className="dark form-label small text-muted">
                Address
              </label>
              <input
                className="dark form-control"
                value={location.address || ""}
                onChange={(e) =>
                  setLocation({ ...location, address: e.target.value })
                }
              />
              {locationErrors.address && (
                <div className="text-danger small">
                  {locationErrors.address}
                </div>
              )}
            </div>

            <div className="row g-2">
              <div className="col-6">
                <label className="dark form-label small text-muted">City</label>
                <input
                  className="dark form-control"
                  value={location.city || ""}
                  onChange={(e) =>
                    setLocation({ ...location, city: e.target.value })
                  }
                />
                {locationErrors.city && (
                  <div className="text-danger small">{locationErrors.city}</div>
                )}
              </div>

              <div className="col-6">
                <label className="dark form-label small text-muted">
                  State
                </label>
                <input
                  className="dark form-control"
                  value={location.state || ""}
                  onChange={(e) =>
                    setLocation({ ...location, state: e.target.value })
                  }
                />
                {locationErrors.state && (
                  <div className="text-danger small">
                    {locationErrors.state}
                  </div>
                )}
              </div>

              <div className="col-6">
                <label className="dark form-label small text-muted">ZIP</label>
                <input
                  className="dark form-control"
                  value={location.area_code || ""}
                  onChange={(e) =>
                    setLocation({ ...location, area_code: e.target.value })
                  }
                />
                {locationErrors.area_code && (
                  <div className="text-danger small">
                    {locationErrors.area_code}
                  </div>
                )}
              </div>

              <div className="col-6">
                <label className="dark form-label small text-muted">
                  Country
                </label>
                <input
                  className="dark form-control"
                  value={location.country || ""}
                  onChange={(e) =>
                    setLocation({ ...location, country: e.target.value })
                  }
                />
                {locationErrors.country && (
                  <div className="text-danger small">
                    {locationErrors.country}
                  </div>
                )}
              </div>
            </div>
          </fieldset>

          <div className="dark d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-dark"
              disabled={loading || !isFormValid}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  />
                  Creating…
                </>
              ) : (
                "Create Service"
              )}
            </button>
          </div>
        </form>

        {/* existing services display */}
        <hr />
        <h6>Your services</h6>
        {loading && <div>Loading…</div>}
        {!loading && services.length === 0 && <div>No services yet</div>}
        <ul>
          {services.map((s: any) => (
            <ServiceCard service={s} key={s.id} />
          ))}
        </ul>
      </div>
    </div>
  );
}
