import { getDb } from "../../../lib/db";

function generateAppointmentId() {
  const num = Math.floor(Math.random() * 900000 + 100000);
  const suffix = Math.floor(Math.random() * 90 + 10);
  return `#APT-${num}-${suffix}`;
}

function formatAppointmentDate(datetimeLocal) {
  const [datePart] = datetimeLocal.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatAppointmentTime(datetimeLocal) {
  const timePart = datetimeLocal.split("T")[1];
  if (!timePart) return "";

  const [hours, minutes] = timePart.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatCreatedAt() {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const firstName = body.firstName?.trim();
    const lastName = body.lastName?.trim();
    const phone = body.phone?.trim();
    const email = body.email?.trim() || "";
    const service = body.service?.trim();
    const datetime = body.datetime?.trim();
    const message = body.message?.trim() || "";

    if (!firstName || !lastName || !phone || !service || !datetime) {
      return Response.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    const sql = getDb();
    const id = generateAppointmentId();
    const customer = `${firstName} ${lastName}`;
    const date = formatAppointmentDate(datetime);
    const time = formatAppointmentTime(datetime);
    const createdAt = formatCreatedAt();

    await sql`
      INSERT INTO appointments (
        id,
        customer,
        first_name,
        last_name,
        phone,
        email,
        service,
        staff,
        date,
        time,
        duration,
        status,
        created_at,
        message,
        id_number
      ) VALUES (
        ${id},
        ${customer},
        ${firstName},
        ${lastName},
        ${phone},
        ${email},
        ${service},
        ${""},
        ${date},
        ${time},
        ${""},
        ${"pending"},
        ${createdAt},
        ${message},
        ${""}
      )
    `;

    return Response.json({ success: true, id });
  } catch (error) {
    console.error("Appointment insert failed:", error);
    return Response.json(
      { error: "Failed to book appointment. Please try again." },
      { status: 500 }
    );
  }
}
