import io
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer,
                                 Table, TableStyle, HRFlowable, PageBreak)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY


# Color palette
BRAND_DARK = colors.HexColor('#0F172A')
BRAND_PRIMARY = colors.HexColor('#6366F1')
BRAND_ACCENT = colors.HexColor('#10B981')
BRAND_LIGHT = colors.HexColor('#F1F5F9')
BRAND_MUTED = colors.HexColor('#64748B')
BRAND_WHITE = colors.white


def get_styles():
    styles = getSampleStyleSheet()
    custom = {
        'cover_title': ParagraphStyle(
            'CoverTitle', fontSize=28, leading=34,
            textColor=BRAND_WHITE, alignment=TA_CENTER, fontName='Helvetica-Bold'),
        'cover_sub': ParagraphStyle(
            'CoverSub', fontSize=13, leading=18,
            textColor=colors.HexColor('#CBD5E1'), alignment=TA_CENTER, fontName='Helvetica'),
        'section_heading': ParagraphStyle(
            'SectionHeading', fontSize=14, leading=20, spaceBefore=16, spaceAfter=6,
            textColor=BRAND_PRIMARY, fontName='Helvetica-Bold'),
        'sub_heading': ParagraphStyle(
            'SubHeading', fontSize=11, leading=16, spaceBefore=10, spaceAfter=4,
            textColor=BRAND_DARK, fontName='Helvetica-Bold'),
        'body': ParagraphStyle(
            'Body', fontSize=10, leading=15, spaceAfter=6,
            textColor=BRAND_DARK, alignment=TA_JUSTIFY, fontName='Helvetica'),
        'body_small': ParagraphStyle(
            'BodySmall', fontSize=9, leading=13,
            textColor=BRAND_MUTED, fontName='Helvetica'),
        'badge': ParagraphStyle(
            'Badge', fontSize=9, leading=12,
            textColor=BRAND_WHITE, alignment=TA_CENTER, fontName='Helvetica-Bold'),
        'label': ParagraphStyle(
            'Label', fontSize=8, leading=12,
            textColor=BRAND_MUTED, fontName='Helvetica-Bold'),
    }
    return custom


def generate_plan_pdf(plan) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        leftMargin=1.8*cm, rightMargin=1.8*cm,
        topMargin=1.5*cm, bottomMargin=2*cm
    )

    styles = get_styles()
    story = []
    page_w = A4[0] - 3.6*cm

    # ── COVER PAGE ──────────────────────────────────────────────────────────
    cover_data = [[Paragraph(
        f'<font color="#6366F1">DAN</font> — Assistant Pédagogique IA',
        styles['cover_sub']
    )]]
    cover_bg = Table(cover_data, colWidths=[page_w])
    cover_bg.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), BRAND_DARK),
        ('ROUNDEDCORNERS', [8]),
        ('TOPPADDING', (0, 0), (-1, -1), 30),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(cover_bg)
    story.append(Spacer(1, 0.3*cm))

    title_data = [[Paragraph(plan.generated_title or plan.theme, styles['cover_title'])]]
    title_tbl = Table(title_data, colWidths=[page_w])
    title_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), BRAND_DARK),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 30),
    ]))
    story.append(title_tbl)
    story.append(Spacer(1, 0.5*cm))

    # Info cards
    info_items = [
        ('📚 Matière', plan.subject),
        ('🎓 Niveau', plan.get_level_display()),
        ('⏱ Durée', plan.duration),
        ('👤 Enseignant', plan.author.full_name),
        ('📅 Date', plan.created_at.strftime('%d/%m/%Y')),
    ]
    info_data = [[
        Paragraph(f'<b>{k}</b><br/>{v}', styles['body_small'])
        for k, v in info_items
    ]]
    info_tbl = Table(info_data, colWidths=[page_w/5]*5)
    info_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), BRAND_LIGHT),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('ROUNDEDCORNERS', [6]),
    ]))
    story.append(info_tbl)
    story.append(PageBreak())

    # ── OBJECTIVES ──────────────────────────────────────────────────────────
    story.append(Paragraph('🎯 Objectifs Pédagogiques', styles['section_heading']))
    story.append(HRFlowable(width=page_w, thickness=1, color=BRAND_PRIMARY))
    story.append(Spacer(1, 0.2*cm))
    story.append(Paragraph(plan.generated_objectives, styles['body']))

    # ── PREREQUISITES ────────────────────────────────────────────────────────
    story.append(Paragraph('📋 Prérequis', styles['section_heading']))
    story.append(HRFlowable(width=page_w, thickness=1, color=BRAND_PRIMARY))
    story.append(Spacer(1, 0.2*cm))
    story.append(Paragraph(plan.generated_prerequisites, styles['body']))

    # ── INTRODUCTION ─────────────────────────────────────────────────────────
    story.append(Paragraph('📖 Introduction', styles['section_heading']))
    story.append(HRFlowable(width=page_w, thickness=1, color=BRAND_PRIMARY))
    story.append(Spacer(1, 0.2*cm))
    story.append(Paragraph(plan.generated_introduction, styles['body']))

    # ── DETAILED PLAN ────────────────────────────────────────────────────────
    story.append(Paragraph('📐 Plan Détaillé du Cours', styles['section_heading']))
    story.append(HRFlowable(width=page_w, thickness=1, color=BRAND_PRIMARY))
    story.append(Spacer(1, 0.2*cm))

    for step in plan.generated_plan:
        step_num = step.get('step', '')
        step_title = step.get('title', '')
        duration = step.get('duration', '')
        content = step.get('content', '')
        method = step.get('method', '')

        header_data = [[
            Paragraph(f'Étape {step_num} — {step_title}', styles['sub_heading']),
            Paragraph(f'⏱ {duration}', styles['body_small'])
        ]]
        header_tbl = Table(header_data, colWidths=[page_w*0.75, page_w*0.25])
        header_tbl.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), BRAND_LIGHT),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('LEFTPADDING', (0, 0), (0, -1), 10),
            ('RIGHTPADDING', (-1, 0), (-1, -1), 10),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        story.append(header_tbl)
        story.append(Paragraph(content, styles['body']))
        if method:
            story.append(Paragraph(f'<i>Méthode : {method}</i>', styles['body_small']))
        story.append(Spacer(1, 0.3*cm))

    # ── ACTIVITIES ───────────────────────────────────────────────────────────
    story.append(Paragraph('🧩 Activités Pédagogiques', styles['section_heading']))
    story.append(HRFlowable(width=page_w, thickness=1, color=BRAND_PRIMARY))
    story.append(Spacer(1, 0.2*cm))

    for act in plan.generated_activities:
        story.append(Paragraph(f'▸ {act.get("title", "")} '
                                f'<font color="#6366F1">({act.get("type", "")})</font> '
                                f'— {act.get("duration", "")}', styles['sub_heading']))
        story.append(Paragraph(act.get('description', ''), styles['body']))
        if act.get('objective'):
            story.append(Paragraph(f'<i>Objectif : {act["objective"]}</i>', styles['body_small']))
        story.append(Spacer(1, 0.2*cm))

    # ── MATERIALS ────────────────────────────────────────────────────────────
    if plan.generated_materials:
        story.append(Paragraph('🛠 Matériel Pédagogique', styles['section_heading']))
        story.append(HRFlowable(width=page_w, thickness=1, color=BRAND_PRIMARY))
        story.append(Spacer(1, 0.2*cm))
        mat_data = [['Matériel', 'Type', 'Description']]
        for mat in plan.generated_materials:
            mat_data.append([
                Paragraph(mat.get('name', ''), styles['body_small']),
                Paragraph(mat.get('type', ''), styles['body_small']),
                Paragraph(mat.get('description', ''), styles['body_small']),
            ])
        mat_tbl = Table(mat_data, colWidths=[page_w*0.25, page_w*0.2, page_w*0.55])
        mat_tbl.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), BRAND_PRIMARY),
            ('TEXTCOLOR', (0, 0), (-1, 0), BRAND_WHITE),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 9),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [BRAND_WHITE, BRAND_LIGHT]),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ]))
        story.append(mat_tbl)
        story.append(Spacer(1, 0.3*cm))

    # ── CONCLUSION ───────────────────────────────────────────────────────────
    story.append(Paragraph('✅ Conclusion', styles['section_heading']))
    story.append(HRFlowable(width=page_w, thickness=1, color=BRAND_PRIMARY))
    story.append(Spacer(1, 0.2*cm))
    story.append(Paragraph(plan.generated_conclusion, styles['body']))

    # ── EVALUATION ───────────────────────────────────────────────────────────
    story.append(PageBreak())
    eval_header = [[Paragraph('📝 Section Évaluation', styles['cover_title'])]]
    eval_tbl = Table(eval_header, colWidths=[page_w])
    eval_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), BRAND_DARK),
        ('TOPPADDING', (0, 0), (-1, -1), 20),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 20),
    ]))
    story.append(eval_tbl)
    story.append(Spacer(1, 0.5*cm))

    # MCQ
    if plan.generated_mcq:
        story.append(Paragraph('🔵 Questions à Choix Multiples (QCM)', styles['section_heading']))
        story.append(HRFlowable(width=page_w, thickness=1, color=BRAND_ACCENT))
        story.append(Spacer(1, 0.2*cm))
        for i, q in enumerate(plan.generated_mcq, 1):
            story.append(Paragraph(f'<b>Q{i}.</b> {q.get("question", "")}', styles['body']))
            for opt in q.get('options', []):
                story.append(Paragraph(f'&nbsp;&nbsp;&nbsp;{opt}', styles['body_small']))
            story.append(Spacer(1, 0.15*cm))

    # Open questions
    if plan.generated_open_questions:
        story.append(Paragraph('✏️ Questions Ouvertes', styles['section_heading']))
        story.append(HRFlowable(width=page_w, thickness=1, color=BRAND_ACCENT))
        story.append(Spacer(1, 0.2*cm))
        for i, q in enumerate(plan.generated_open_questions, 1):
            story.append(Paragraph(
                f'<b>Q{i}. ({q.get("points", "")} pts)</b> {q.get("question", "")}',
                styles['body']))
            story.append(Spacer(1, 0.5*cm))

    # Practical exercise
    if plan.generated_practical_exercise:
        story.append(Paragraph('⚙️ Exercice Pratique', styles['section_heading']))
        story.append(HRFlowable(width=page_w, thickness=1, color=BRAND_ACCENT))
        story.append(Spacer(1, 0.2*cm))
        story.append(Paragraph(plan.generated_practical_exercise, styles['body']))

    # Answer key
    if plan.generated_answer_key:
        story.append(PageBreak())
        story.append(Paragraph('🔑 Corrigé Détaillé', styles['section_heading']))
        story.append(HRFlowable(width=page_w, thickness=1, color=BRAND_ACCENT))
        story.append(Spacer(1, 0.2*cm))
        story.append(Paragraph(plan.generated_answer_key, styles['body']))

    # Footer note
    story.append(Spacer(1, 1*cm))
    story.append(HRFlowable(width=page_w, thickness=0.5, color=BRAND_MUTED))
    story.append(Spacer(1, 0.2*cm))
    story.append(Paragraph(
        f'Généré par <b>DAN</b> — Assistant Pédagogique IA  |  {plan.created_at.strftime("%d/%m/%Y à %H:%M")}',
        styles['body_small']))

    doc.build(story)
    return buffer.getvalue()
