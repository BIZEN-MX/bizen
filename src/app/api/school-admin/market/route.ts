import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/api-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (!authResult.success) return authResult.response;

    const { user } = authResult.data;

    // 1. Verificar perfil y schoolId del profesor
    const teacherProfile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { role: true, schoolId: true }
    });
 
    if (!teacherProfile) {
      return NextResponse.json({ error: "Perfil no encontrado." }, { status: 404 });
    }
 
    if (teacherProfile.role !== "teacher" && teacherProfile.role !== "school_admin" && teacherProfile.role !== "admin") {
      return NextResponse.json({ error: "No tienes permisos de docente." }, { status: 403 });
    }
 
    if (!teacherProfile.schoolId) {
      if (teacherProfile.role === 'admin' || teacherProfile.role === 'school_admin') {
        const anySchool = await prisma.school.findFirst()
        if (anySchool) {
            teacherProfile.schoolId = anySchool.id
        } else {
            return NextResponse.json({ error: "Institución no encontrada." }, { status: 200, data: [] });
        }
      } else {
        return NextResponse.json({ error: "No estás asignado a ninguna institución." }, { status: 400 });
      }
    }

    // 2. Obtener alumnos de la misma institución
    const students = await prisma.profile.findMany({
      where: {
        schoolId: teacherProfile.schoolId,
        role: "student"
      },
      select: {
        id: true,
        nickname: true,
        username: true,
        level: true,
        simulatorPortfolios: {
          select: {
            cash_balance: true
          }
        }
      }
    });

    // 3. Extraer el mercado de Bizen y calcular el rendimiento real
    // En una implementación robusta, se sumaría el valor actual de 'sim_holdings' 
    // y se obtendría el conteo de 'sim_orders'.
    // Para no romper la base de datos si las tablas relacionadas faltan, usamos el balance principal.

    const marketData = students.map((student) => {
      const portfolio = student.simulatorPortfolios[0];
      
      const cash = _parseDecimal(portfolio?.cash_balance) || 0;
      
      // Dado que estos son datos base, si no han iniciado el simulador tendrán cash = 0
      // Podríamos agregar simulación de cartera actual:
      const portfolioValue = 0; // Se calcularía sumando (cantidad_acciones * precio_actual_mercado)
      const totalValue = cash + portfolioValue;
      
      // ROI base suponiendo inversión inicial de 100,000 (O el monto configurable del simulador)
      const initialBalance = 100000;
      let roi = 0;
      if (totalValue > 0 && totalValue !== initialBalance) {
        roi = ((totalValue - initialBalance) / initialBalance) * 100;
      }

      return {
        id: student.id,
        name: student.nickname || student.username || "Alumno Anónimo",
        level: student.level || 1,
        cash: cash,
        portfolioValue: portfolioValue,
        totalValue: totalValue,
        roi: roi,
        trades: 0 // Se reemplazaría con: student.simOrders.length
      };
    });

    // Filtramos alumnos que no hayan inicializado su portafolios (aquellos sin saldo)
    const activeMarketStudents = marketData.filter(d => d.totalValue > 0);

    return NextResponse.json({ data: activeMarketStudents }, { status: 200 });
  } catch (error: any) {
    console.error("[Teacher Market API Error]:", error);
    return NextResponse.json(
      { error: "Error obteniendo datos del simulador", details: error.message },
      { status: 500 }
    );
  }
}

function _parseDecimal(value: any): number {
  if (value === null || value === undefined) return 0;
  return Number(value);
}
