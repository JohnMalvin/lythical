import { connectDB } from "@/lib/mongodb";
import { Result } from "@/lib/interface";
import Project, { IPublicProject } from "@/models/Project";
import User, { IPublicUser } from "@/models/User";
import { CreateProjectZod, createProjectZod } from "@/lib/zod";
import { randomUUID } from "crypto";

// Create a project
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

// Get all project for user
export async function GET(request: Request) {
  try {

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return Response.json({ error: 'Email error' }, { status: 400 });
    }

    const result = await handleGetProjects(email);

    if (!result.success) {
      return Response.json(
        { error: result.error },
        { status: 401 }
      );
    }

    return Response.json(
      {
        message: "Projects retrieved successful",
        projects: result.data
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Project retrieval error:", error);

    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}





//Helpers/handlers//

export async function handleGetProjects(email: string): Promise<Result<IPublicProject[]>> {
  await connectDB();
  const user = await User.findOne({ email }).select('_id').lean();

  if (!user) {
    return {
			success: false,
			error: "User doesn't exist"
		};
  }

  const projects = await Project.find({ Owner: user._id })
    
  const formattedProjects = projects.map((project) => ({
    owner: project.owner,
    projectName: project.projectName,
    description: project.description
  }));

  return {
    success: true,
    data: formattedProjects
  }
}


async function handleCreateProject(data: CreateProjectZod, email: string): Promise<Result<IPublicProject>> {
  await connectDB();
  const user = await User.findOne({ email }).select('_id').lean();
  const userId = user._id.toString()

  // maybe check if user exists?

	const existingProject = await Project.findOne({
		owner: userId,
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
		owner: userId,
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
