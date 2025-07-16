const RecipePreview = ({ data }) => {
  const { title, photo, time, ingredients, instructions, course } = data;

  return (
    <div className="mt-4 bg-gray-100 p-4 rounded">
      <h3 className="text-xl font-semibold">{title}</h3>
      {photo && (
        <img
          src={photo}
          alt={title}
          className="w-full h-auto mt-2 mb-4 rounded"
        />
      )}
      <p>
        <strong>Time:</strong> {time?.hours} hr {time?.minutes} min
      </p>
      <p>
        <strong>Course:</strong> {course?.join(", ")}
      </p>
      <h4 className="mt-2 font-semibold">Ingredients</h4>
      <ul className="list-disc pl-6">
        {ingredients.map((item, i) => (
          <li key={i}> {item} </li>
        ))}
      </ul>
      <h4 className="mt-2 font-semibold">Instructions:</h4>
      <ol className="list-decimal pl-6">
        {instructions.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
    </div>
  );
};

export default RecipePreview