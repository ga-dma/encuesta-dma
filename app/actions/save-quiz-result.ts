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
        const a = payload.answers;

        const result = await sql`
            INSERT INTO quiz_submissions (
                category_id,
                category_name,
                score,
                maturity_title,
                description,
                suggestion,
                email,
                miq1, miq2, miq3, miq4, miq5,
                biq1, biq2, biq3, biq4, biq5,
                deq1, deq2, deq3, deq4, deq5
            )
            VALUES (
                ${payload.category_id},
                ${payload.category_name},
                ${payload.score},
                ${payload.maturityTitle},
                ${payload.description},
                ${payload.suggestion},
                ${payload.email || null},
                ${a.MIQ1 ?? null}, ${a.MIQ2 ?? null}, ${a.MIQ3 ?? null}, ${a.MIQ4 ?? null}, ${a.MIQ5 ?? null},
                ${a.BIQ1 ?? null}, ${a.BIQ2 ?? null}, ${a.BIQ3 ?? null}, ${a.BIQ4 ?? null}, ${a.BIQ5 ?? null},
                ${a.DEQ1 ?? null}, ${a.DEQ2 ?? null}, ${a.DEQ3 ?? null}, ${a.DEQ4 ?? null}, ${a.DEQ5 ?? null}
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
