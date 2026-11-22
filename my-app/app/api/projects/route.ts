import { connectDB } from "@/lib/mongodb";
import { Result } from "@/lib/interface";
import Project, { IPublicProject } from "@/models/Project";
import { CreateProjectZod, createProjectZod } from "@/lib/zod";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = createProjectZod.safeParse(body);

    if (!validation.success) {
      return Response.json(
        {
          error: Object.values(validation.error.flatten().fieldErrors).flat()[0]
        },
        { status: 400 }
      );
    }

		const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

		if (!email) {
			return Response.json(
        {
          error: "email does not exist"
        },
        { status: 400 }
      );
		}
    const result = await handleCreateProject(validation.data, email);

    if (!result.success) {
      return Response.json(
        { error: result.error },
        { status: 401 }
      );
    }

    return Response.json(
      {
        message: "Project creation successful",
        user: result.data
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Project creation error:", error);

    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleCreateProject(data: CreateProjectZod, email: string): Promise<Result<IPublicProject>> {
  await connectDB();

	const existingProject = await Project.findOne({
		owner: email,
  	projectName: data.title,
	}).lean();

	if (existingProject) {
		return {
			success: false,
			error: "Project with same name exists"
		};
	}

	const project = await Project.create({
		projectName: data.title,
		owner: email,
		projectKey: randomUUID(),
		description: data.description 
	});

	return {
		success: true,
		data: {
			owner: project.owner,
			projectName: project.projectName,
			description: project.description
		}
	};
}
