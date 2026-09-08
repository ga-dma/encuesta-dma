"use server";

import { getDb } from "@/lib/db";

export type QuizResultPayload = {
    category_id: string;
    category_full_id: string;
    category_name: string;
    score: number;
    maturityTitle: string;
    description: string;
    suggestion: string;
    answers: Record<string, number>;
    email?: string;
};

export async function saveQuizResult(payload: QuizResultPayload) {
    console.log("🚀 [Server Action] Guardando resultados...");

    try {
        const sql = getDb();

        const prefix = payload.category_full_id;
        const q1 = payload.answers[`${prefix}1`] || null;
        const q2 = payload.answers[`${prefix}2`] || null;
        const q3 = payload.answers[`${prefix}3`] || null;
        const q4 = payload.answers[`${prefix}4`] || null;
        const q5 = payload.answers[`${prefix}5`] || null;

        const result = await sql`
            INSERT INTO quiz_submissions (
                category_id, 
                category_name, 
                q1, q2, q3, q4, q5, 
                score, 
                maturity_title, 
                description, 
                suggestion, 
                email
            )
            VALUES (
                ${payload.category_id},
                ${payload.category_name},
                ${q1}, ${q2}, ${q3}, ${q4}, ${q5},
                ${payload.score},
                ${payload.maturityTitle},
                ${payload.description},
                ${payload.suggestion},
                ${payload.email || null}
            )
            RETURNING id
        `;

        const submissionId = result[0].id;
        console.log("✅ Guardado exitoso. ID:", submissionId);

        return { success: true, submissionId };
    } catch (err: any) {
        console.error("❌ Error al guardar:", err.message);
        return { error: err.message };
    }
}

export async function updateQuizResultEmail(
    category_name: string,
    score: number,
    email: string
) {
    try {
        const sql = getDb();
        await sql`
            UPDATE quiz_submissions
            SET email = ${email}
            WHERE id = (
                SELECT id FROM quiz_submissions
                WHERE category_name = ${category_name}
                AND score = ${score}
                AND email IS NULL
                ORDER BY created_at DESC
                LIMIT 1
            )
        `;
        return { success: true };
    } catch (err: any) {
        console.error("❌ Error al actualizar email:", err.message);
        return { error: err.message };
    }
}
